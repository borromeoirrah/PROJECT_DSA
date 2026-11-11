//=========================================================================
        // SEMANTIC VERSIONING (SemVer 2.0.0)
        // Single source of truth. Do not hard-code the version elsewhere.
        // MAJOR: breaking change (e.g. changing bridge function names/signatures that Python depends on)
        // MINOR: new backward-compatible feature (e.g. finishing a new topic's code)
        // PATCH: bug fix or small tweak with no new feature
        // Use 0.x.y while in development; move to 1.0.0 once all 11 topics are complete.
        //=========================================================================
        const APP_VERSION = "0.3.0";
        let pyodideInstance = null;
        let gardenPlants = {};
        // Display-only list of action labels (populated by Python via pushAction). No JS game logic.
        let displayActionHistory = [];

        //=========================================================================
        // TOPIC TEMPLATES — paste your Python for each topic into the matching entry.
        // Call the bridge functions from your Python to update the UI.
        //=========================================================================
        const topicTemplates = {
            1: {
                title: "TOPIC 1: Python OOP + Big O + Stacks",
                code: `# Topic 1: Python OOP + Big O + Stacks
# ==== WRITE YOUR CODE HERE ====
# Use pushAction(action_str) to display history entries.
# Use updateResources(...) to set resource values.
# ==== ==== ==== ==== ==== ====



class Plant:
    def __init__(self, name, water_need):
        self.name = name
        self.water_need = water_need
        self.health = 100

        print(f"Congrats, your plant named {self.name}created successfully!")

plant_obj = Plant("Strawberry🍓", 10)

updateResources(
    water=200,
    seeds=90,
    energy=110,
    hope=80,
    coins=999
)
    
addPlantsToDropdown([
    ("Strawberry", "🍓", 20),
    ("Orange", "🍊", 10),
    ("Tomato", "", 15),
    ("Carrot", "🥕", 12),
    ("Ginger", "🫚", 8)
])

print(" Resource Storage and Plant dropdown unlocked!")

# ==== Stacks ====
class ActionHistoryStack:
    def __init__(self):
        self.plant_stack = []
   
    def push_action(self, plant_name):
        self.plant_stack.append(plant_name)
        pushAction(action_string)

    def pop_action(self):
        if not self.isEmpty():
           top = self.plant_stack[-1]
        return top

    def peek(self):
        if self.isEmpty():
            return "Stack is empty"
        return self.stack[-1]

    def is_empty(self):
        return len(self.stack) == 0

pushAction("strawberry")
pushAction("orange")
pushAction("tomato")
pushAction("carrot")
pushAction("ginger")

print("Action History Stack ready! (push, pop & peek tested)")

`
            },
            2: {
                title: "TOPIC 2: Queues & Deques (FIFO Elements)",
                code: `# Topic 2: Queues & Deques (FIFO Elements)
# ==== WRITE YOUR CODE HERE ====
# Climate hazards are processed one at a time in FIFO order.
# UI bridge: updateClimateQueue(events, active_hazard)
# ==== ==== ==== ==== ==== ====


from collections import deque

class ClimateQueue:
    """FIFO climate hazard queue with one active hazard at a time."""

    ALLOWED_HAZARDS = ("Flood", "Heatwaves", "Earthquake")

    def __init__(self):
        self.queue = deque()
        self.active_hazard = None

    def enqueue_challenge(self, event_name):
        if event_name not in self.ALLOWED_HAZARDS:
            raise ValueError(f"Unknown climate hazard: {event_name}")
        self.queue.append(event_name)
        self.refresh_display()

    def process_hazard(self):
        """Move only the oldest queued hazard into the active state."""
        if self.active_hazard is not None:
            print(f"{self.active_hazard} is still active. Resolve it first.")
            return self.active_hazard
        if not self.queue:
            print("No climate hazards remain in the queue.")
            self.refresh_display()
            return None

        self.active_hazard = self.queue.popleft()
        self.refresh_display()
        pushAction(f"Hazard active: {self.active_hazard}")
        print(f"WARNING: {self.active_hazard} is now active!")
        return self.active_hazard

    def resolve_active_hazard(self):
        if self.active_hazard is None:
            print("There is no active hazard to resolve.")
            return False

        resolved = self.active_hazard
        self.active_hazard = None
        self.refresh_display()
        pushAction(f"Hazard resolved: {resolved}")
        print(f"Resolved: {resolved}. You may process the next hazard.")
        return True

    def refresh_display(self):
        # The active item is displayed separately from the waiting FIFO queue.
        updateClimateQueue(list(self.queue), self.active_hazard)


# Initial queue order is intentional: FIFO processes these in this exact order.
q = ClimateQueue()
q.enqueue_challenge("Flood")
q.enqueue_challenge("Heatwaves")
q.enqueue_challenge("Earthquake")

def process_next_hazard():
    """Called by the Climate Queue's Process Next button."""
    return q.process_hazard()

def resolve_active_hazard():
    """Called by the Climate Queue's Resolve Active button."""
    return q.resolve_active_hazard()

q.refresh_display()
print("Climate Queue (FIFO) ready!")
print("Click 'Process Next Hazard' to activate the next climate hazard in the queue.")

`
            },
            3: {
                title: "TOPIC 3: Static/Dynamic Arrays, 2D Lists, & Memory Structures",
                code: `# Topic 3: Static/Dynamic Arrays, 2D Lists, & Memory Structures
# ==== WRITE YOUR CODE HERE ====
# Use addPlantToGrid(pos, name) and addPlantsToDropdown(plants) for the garden grid.
# ==== ==== ==== ==== ==== ====

from js import document, Audio
from pyodide.ffi import create_proxy


# Background music
bgm = Audio.new(
    "magtanim.mp3"
)
bgm.loop = True
bgm.volume = 0.25

music_started = False

def start_bgm():
    global music_started


    if not music_started:
        bgm.play()
        music_started = True

class Garden:
    def __init__(self):
        # Empty 5x5 garden
        self.grid = [[None for _ in range(5)] for _ in range(5)]

        # Starting resources
        self.seeds = 90
        self.water = 200
        self.coins = 999
        # Growth stages: 0 = seed, 1 = growing, 2 = ready to harvest
        self.growth = [[0 for _ in range(5)] for _ in range(5)]
        self.selected_tile = None
        self.harvested_crops = []  # Shared harvested-crop inventory for Topic 6
        self.next_harvest_id = 1

    def add_plant(self, row, col, plant):

        # Check valid position
        if not (0 <= row < 5 and 0 <= col < 5):
            return False

        # Do not plant on an occupied tile
        if self.grid[row][col] is not None:
            return False

        # Check if there are enough seeds and water
        if self.seeds <= 0:
            print("No seeds left!")
            return False

        # Store the plant as a seed. Water is used only when the Water
        # button is clicked, not when planting.
        self.grid[row][col] = plant
        self.growth[row][col] = 0
        self.selected_tile = (row, col)
        self.seeds -= 1

        # Show the first growth stage (seed).
        self.render_tile(row, col)

        # Update resources after planting.
        updateResources(
            self.water,
            self.seeds,
            110,
            80,
            self.coins
        )

        print(f"🌰 {plant} seed planted! Select this tile, then click Water to grow it.")
        print(f"Seeds: {self.seeds} / 100")
        if self.seeds == 0:
            print("🌱 No seeds left! Use Buy Seed to purchase another seed.")
        # Keep Topic 7's index synchronized when it has been initialized.
        if "sync_plant_hash_table" in globals():
            sync_plant_hash_table()

        return True

    def render_tile(self, row, col):
        """Refresh one garden tile to show its current growth stage."""
        position = row * 5 + col
        grid = document.getElementById("garden-grid")
        cell = grid.children[position]
        cell.innerHTML = ""
        crop_emojis = {
            "Strawberry": "🍓", "Orange": "🍊", "Tomato": "🍅",
            "Carrot": "🥕", "Ginger": "🫚"
        }
        stages = ["🌰", "🌱", crop_emojis.get(self.grid[row][col], "🍓")]
        crop_label = document.createElement("span")
        crop_label.textContent = stages[self.growth[row][col]]
        crop_label.style.fontSize = "1.8rem"
        cell.appendChild(crop_label)
        if self.growth[row][col] == 2:
            harvest_button = document.createElement("button")
            harvest_button.textContent = "🌾 Harvest"
            harvest_button.className = "block mt-2 px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
            harvest_button.setAttribute("type", "button")
            harvest_callback = create_proxy(lambda event, r=row, c=col: self.harvest_plant(r, c, event))
            click_proxies.append(harvest_callback)
            harvest_button.addEventListener("click", harvest_callback)
            cell.appendChild(harvest_button)

    def select_tile(self, row, col):
        if self.grid[row][col] is not None:
            self.selected_tile = (row, col)
            print(f"Selected {self.grid[row][col]} tile. Click Water to grow it.")

    def water_selected(self):
        if self.selected_tile is None:
            print("Select a planted seed tile first.")
            return False
        row, col = self.selected_tile
        if self.grid[row][col] is None:
            print("This tile is empty. Plant a seed first.")
            return False
        if self.growth[row][col] >= 2:
            print("This crop is ready! Click Harvest.")
            return False
        if self.water < 10:
            print("You are out of water! Click Buy Water to get 50 L for 20 coins.")
            return False
        self.water -= 10
        self.growth[row][col] += 1
        self.render_tile(row, col)
        buy_button = document.getElementById("buy-water-button")
        if buy_button and self.water < 10:
            buy_button.style.display = "block"
        stage = ["🌰 Seed", "🌱 Growing", "🍓 Ready to harvest"][self.growth[row][col]]
        updateResources(self.water, self.seeds, 110, 80, self.coins)
        pushAction(f"Watered {self.grid[row][col]}: {stage}")
        print(f"{self.grid[row][col]} growth: {stage}. Water: {self.water} / 200 L")
        # Water level and growth status in Topic 7 are refreshed from this same grid.
        if "sync_plant_hash_table" in globals():
            sync_plant_hash_table()
        return True

    def buy_water(self):
        if self.coins < 20:
            print("Not enough coins! You need 20 coins to buy water.")
            return False
        self.coins -= 20
        self.water = min(200, self.water + 50)
        updateResources(self.water, self.seeds, 110, 80, self.coins)
        buy_button = document.getElementById("buy-water-button")
        if buy_button and self.water >= 10:
            buy_button.style.display = "none"
        pushAction("Bought 50 L water: -20 coins")
        print(f"Bought 50 L water! -20 coins. Water: {self.water} / 200 L | Coins: {self.coins}")
        return True

    def buy_seed(self):
        """Buy one seed for the currently selected plant."""
        selector = document.getElementById("crop-selector")
        plant = selector.value if selector else "Strawberry"
        seed_prices = {
            "Strawberry": 20,
            "Orange": 10,
            "Tomato": 15,
            "Carrot": 12,
            "Ginger": 8
        }
        cost = seed_prices.get(plant)
        if cost is None:
            print("Please select a valid plant first.")
            return False
        if self.coins < cost:
            print(f"Not enough coins! {plant} seed costs {cost} coins.")
            return False

        self.coins -= cost
        self.seeds += 1
        updateResources(self.water, self.seeds, 110, 80, self.coins)
        pushAction(f"Bought 1 {plant} seed: -{cost} coins")
        print(f"🛒 Bought 1 {plant} seed for {cost} coins.")
        print(f"Seeds: {self.seeds} | Coins: {self.coins}")
        return True

    def harvest_plant(self, row, col, event=None):
        # Harvest only a tile that currently contains a crop.
        if event is not None:
            event.stopPropagation()

        if not (0 <= row < 5 and 0 <= col < 5):
            return False

        plant = self.grid[row][col]
        if plant is None:
            print("There is no crop to harvest on this tile.")
            return False
        if self.growth[row][col] < 2:
            print("This crop is not ready yet. Click Water to grow it first.")
            return False

        # Save this successful harvest in the garden's single shared inventory.
        crop_details = {
            "Strawberry": (0.25, 30), "Orange": (0.40, 25),
            "Tomato": (0.30, 20), "Carrot": (0.20, 15), "Ginger": (0.15, 18)
        }
        weight, selling_value = crop_details.get(plant, (0.25, 10))
        self.harvested_crops.append({
            "id": self.next_harvest_id, "name": plant,
            "weight": weight, "selling_value": selling_value
        })
        self.next_harvest_id += 1

        # Remove the crop and give the existing harvest rewards.
        self.grid[row][col] = None
        self.growth[row][col] = 0
        # Harvesting does not refund the seed used to plant this crop.
        self.coins += 5

        position = row * 5 + col
        grid = document.getElementById("garden-grid")
        cell = grid.children[position]
        cell.innerHTML = "⬜"

        updateResources(
            self.water,
            self.seeds,
            110,
            80,
            self.coins
        )

        pushAction(f"Harvested {plant}: +5 coins")
        print(f"🌾 {plant} harvested successfully! Added to Crop Inventory.")
        print("+5 coins received. The planted seed is not refunded.")
        try:
            refresh_harvest_inventory()
        except NameError:
            pass
        # Harvest removes the same plant record from the hash index.
        if "sync_plant_hash_table" in globals():
            sync_plant_hash_table()
        print(f"Coins: {self.coins} | Seeds: {self.seeds}")
        return True

    def remove_plant(self, row, col):

        if 0 <= row < 5 and 0 <= col < 5:
            if self.grid[row][col] is not None:
                self.grid[row][col] = None
                self.growth[row][col] = 0
                position = row * 5 + col
                grid = document.getElementById("garden-grid")
                cell = grid.children[position]

                # Make tile empty again
                cell.innerHTML = "⬜"
                if "sync_plant_hash_table" in globals():
                    sync_plant_hash_table()
                return True
        return False

    def display(self):
        for row in self.grid:
            print(row)

# Create garden
garden = Garden()

# Seed Bag
addPlantsToDropdown([
    ("Strawberry", "🍓", 20),
    ("Orange", "🍊", 10),
    ("Tomato", "🍅", 15),
    ("Carrot", "🥕", 12),
    ("Ginger", "🫚", 8)
])

# Initial resources
updateResources(
    200,   # Water Reserves
    90,    # Seed Inventory
    110,   # Solar Energy
    80,    # Community Hope
    999    # Coins / Dues
)

# Keep click functions alive
click_proxies = []

# Buy one seed for the plant currently selected in the Seed Bag.
buy_seed_button = document.getElementById("buy-seed-button")
if buy_seed_button is not None:
    buy_seed_callback = create_proxy(lambda event: garden.buy_seed())
    buy_seed_button.addEventListener("click", buy_seed_callback)
    click_proxies.append(buy_seed_callback)

# When a tile is clicked


def plant_clicked(position):
    # Start background music on the first tile click
    start_bgm()


    row = position // 5
    col = position % 5


    # Get selected plant
    selector = document.getElementById("crop-selector")
    plant = selector.value


    # Clicking an occupied crop selects it for watering.
    if garden.grid[row][col] is not None:
        garden.select_tile(row, col)
        return
    # Plant the selected dropdown crop as a seed.
    garden.add_plant(row, col, plant)


# Make 25 tiles clickable
def setup_grid_clicks():
    grid = document.getElementById("garden-grid")
    for i in range(25):
        cell = grid.children[i]
        callback = create_proxy(
            lambda event, pos=i: plant_clicked(pos)
        )
        click_proxies.append(callback)
        cell.addEventListener("click", callback)


# Activate clickable garden
setup_grid_clicks()
print("Garden Grid unlocked! Select Strawberry, Orange, Tomato, Carrot, or Ginger. Click an empty tile to plant.")


`




            },
            4: {
                title: "TOPIC 4: Hierarchical Trees & Traversals",
                code: `# Topic 4: Hierarchical Trees & Traversals
# ==== WRITE YOUR CODE HERE ====
# ==========================================
# CREATE TREE UI
# ==========================================

from js import document
from pyodide.ffi import create_proxy

# ==========================================
# TREE NODE
# ==========================================

class GardenNode:

    def __init__(self, name, emoji):
        self.name = name
        self.emoji = emoji
        self.children = []


# ==========================================
# CREATE GARDEN TREE
# ==========================================

seed = GardenNode("Seed", "🌱")

fruits = GardenNode("Fruits", "🍎")
vegetables = GardenNode("Vegetables", "🥕")

strawberry = GardenNode("Strawberry", "🍓")
orange = GardenNode("Orange", "🍊")

tomato = GardenNode("Tomato", "🍅")
carrot = GardenNode("Carrot", "🥕")
ginger = GardenNode("Ginger", "🫚")


# Build hierarchy

seed.children = [
    fruits,
    vegetables
]

fruits.children = [
    strawberry,
    orange
]

vegetables.children = [
    tomato,
    carrot,
    ginger
]

# ==========================================
# VARIABLES
# ==========================================

selected_node = None
selected_traversal = "BFS"

tree_proxies = []

# ==========================================
# BFS
# ==========================================

def bfs(root):

    result = []
    queue = [root]

    while queue:

        node = queue.pop(0)
        result.append(node)

        for child in node.children:
            queue.append(child)

    return result


# ==========================================
# DFS PREORDER
# ==========================================

def preorder(node, result=None):

    if result is None:
        result = []

    result.append(node)

    for child in node.children:
        preorder(child, result)

    return result


# ==========================================
# DFS INORDER
# ==========================================

def inorder(node, result=None):

    if result is None:
        result = []

    if len(node.children) > 0:
        inorder(node.children[0], result)

    result.append(node)

    for child in node.children[1:]:
        inorder(child, result)

    return result


# ==========================================
# DFS POSTORDER
# ==========================================

def postorder(node, result=None):

    if result is None:
        result = []

    for child in node.children:
        postorder(child, result)

    result.append(node)

    return result


# ==========================================
# GET TRAVERSAL
# ==========================================

def get_traversal():

    if selected_traversal == "BFS":
        return bfs(seed)

    elif selected_traversal == "Preorder":
        return preorder(seed)

    elif selected_traversal == "Inorder":
        return inorder(seed)

    elif selected_traversal == "Postorder":
        return postorder(seed)

    return bfs(seed)


# ==========================================
# OUTPUT
# ==========================================

def display_output(message):

    output = document.getElementById(
        "tree-output"
    )

    if output:
        output.innerHTML = (
            f'<div class="text-emerald-300">{message}</div>'
        )


# ==========================================
# STATUS
# ==========================================

def update_status(message):

    status = document.getElementById(
        "tree-status"
    )

    if status:
        status.textContent = message


# ==========================================
# SELECT NODE
# ==========================================

def select_node(node):

    global selected_node

    selected_node = node

    # ======================================
    # SEED SELECTED
    # ======================================

    if node == seed:

        update_status(
            "🌱 Seed selected. Choose Fruits or Vegetables."
        )

        display_output(
            "Choose categories: Fruits or Vegetables"
        )

        show_category_buttons()

        return


    # ======================================
    # FRUITS SELECTED
    # ======================================

    if node == fruits:

        update_status(
            "🍎 Fruits selected. Choose Strawberry or Orange."
        )

        display_output(
            "Choose fruit: Strawberry or Orange"
        )

        show_fruit_buttons()

        return


    # ======================================
    # VEGETABLES SELECTED
    # ======================================

    if node == vegetables:

        update_status(
            "🥕 Vegetables selected. Choose Tomato, Carrot, or Ginger."
        )

        display_output(
            "Choose vegetable: Tomato, Carrot, or Ginger"
        )

        show_vegetable_buttons()

        return


    # ======================================
    # SPECIFIC PLANT SELECTED
    # ======================================

    update_status(
        f"{node.emoji} {node.name} selected. Click Plant."
    )

    display_output(
        f"Selected: {node.name}"
    )

    # Show Plant button
    show_action_buttons()


# ==========================================
# CHANGE TRAVERSAL
# ==========================================

def change_traversal(event):

    global selected_traversal

    selector = document.getElementById(
        "garden-traversal"
    )

    selected_traversal = selector.value

    update_status(
        f"{selected_traversal} selected."
    )


# ==========================================
# GARDEN ACTIONS
# ==========================================

def perform_action(action):

    # ======================================
    # PLANT
    # ======================================

    if action == "Plant":

        # No plant selected
        if selected_node is None:

            display_output(
                "Please select Seed first."
            )

            return


        # Seed selected
        if selected_node == seed:

            display_output(
                "Please choose Fruits or Vegetables first."
            )

            return


        # Category selected
        if selected_node == fruits:

            display_output(
                "Please choose Strawberry or Orange first."
            )

            return


        if selected_node == vegetables:

            display_output(
                "Please choose Tomato, Carrot, or Ginger first."
            )

            return


        # ==================================
        # SPECIFIC PLANT
        # ==================================

        plant_name = selected_node.name.lower()

        display_output(
            f"Planted {plant_name}"
        )

        update_status(
            f"{selected_node.emoji} Planted {plant_name}"
        )

        return


    # ======================================
    # WATER
    # ======================================

    if action == "Water":
        garden.water_selected()
        return


# ==========================================
# NODE BUTTON
# ==========================================

def create_node_button(node):

    button = document.createElement(
        "button"
    )

    button.textContent = (
        f"{node.emoji} {node.name}"
    )

    button.className = (
        "px-3 py-2 rounded-lg "
        "font-bold text-white "
        "whitespace-nowrap "
        "cursor-pointer "
        "transition "
        "hover:brightness-110 "
        "active:scale-95"
    )


    # ======================================
    # COLORS
    # ======================================

    if node == seed:

        button.className += (
            " bg-green-700"
        )

    elif node == fruits:

        button.className += (
            " bg-orange-700"
        )

    elif node == vegetables:

        button.className += (
            " bg-yellow-700"
        )

    elif node == strawberry:

        button.className += (
            " bg-red-700"
        )

    elif node == orange:

        button.className += (
            " bg-orange-600"
        )

    elif node == tomato:

        button.className += (
            " bg-red-600"
        )

    elif node == carrot:

        button.className += (
            " bg-orange-500"
        )

    elif node == ginger:

        button.className += (
            " bg-yellow-600"
        )


    # ======================================
    # CLICK EVENT
    # ======================================

    callback = create_proxy(
        lambda event, n=node:
        select_node(n)
    )

    button.addEventListener(
        "click",
        callback
    )

    tree_proxies.append(callback)

    return button


# ==========================================
# SHOW / HIDE TREE BUTTONS
# ==========================================

def hide_all_choices():

    choices = [
        "fruits-button",
        "vegetables-button",
        "strawberry-button",
        "orange-button",
        "tomato-button",
        "carrot-button",
        "ginger-button",
        "plant-action-button",
        "water-action-button"
    ]

    for button_id in choices:

        element = document.getElementById(
            button_id
        )

        if element:
            element.style.display = "none"


# ==========================================
# SHOW CATEGORY BUTTONS
# ==========================================

def show_category_buttons():

    hide_all_choices()

    fruits_button = document.getElementById(
        "fruits-button"
    )

    vegetables_button = document.getElementById(
        "vegetables-button"
    )

    if fruits_button:
        fruits_button.style.display = "block"

    if vegetables_button:
        vegetables_button.style.display = "block"


# ==========================================
# SHOW FRUIT BUTTONS
# ==========================================

def show_fruit_buttons():

    hide_all_choices()

    strawberry_button = document.getElementById(
        "strawberry-button"
    )

    orange_button = document.getElementById(
        "orange-button"
    )

    if strawberry_button:
        strawberry_button.style.display = "block"

    if orange_button:
        orange_button.style.display = "block"


# ==========================================
# SHOW VEGETABLE BUTTONS
# ==========================================

def show_vegetable_buttons():

    hide_all_choices()

    tomato_button = document.getElementById(
        "tomato-button"
    )

    carrot_button = document.getElementById(
        "carrot-button"
    )

    ginger_button = document.getElementById(
        "ginger-button"
    )

    if tomato_button:
        tomato_button.style.display = "block"

    if carrot_button:
        carrot_button.style.display = "block"

    if ginger_button:
        ginger_button.style.display = "block"


# ==========================================
# SHOW ACTION BUTTONS
# ==========================================

def show_action_buttons():

    plant_button = document.getElementById(
        "plant-action-button"
    )

    water_button = document.getElementById(
        "water-action-button"
    )

    if plant_button:
        plant_button.style.display = "block"

    if water_button:
        water_button.style.display = "block"


# ==========================================
# CREATE HIERARCHICAL TREE UI
# ==========================================

def create_tree_ui():

    game = document.getElementById(
        "view-game"
    )

    # Remove old panel
    old_panel = document.getElementById(
        "hierarchical-tree-panel"
    )

    if old_panel:
        old_panel.remove()


    # ======================================
    # MAIN PANEL
    # ======================================

    panel = document.createElement(
        "div"
    )

    panel.id = (
        "hierarchical-tree-panel"
    )

    panel.className = (
        "mt-4 p-4 rounded-2xl "
        "bg-[#172017] "
        "border border-emerald-800"
    )


    # ======================================
    # TITLE
    # ======================================

    title = document.createElement(
        "h3"
    )

    title.className = (
        "text-lg font-bold "
        "text-emerald-300"
    )

    title.textContent = (
        "🌱 Hierarchical Garden Tree"
    )

    panel.appendChild(title)


    description = document.createElement(
        "p"
    )

    description.className = (
        "text-sm text-gray-400 mb-4"
    )

    description.textContent = (
        "Click a tree node to select it."
    )

    panel.appendChild(description)


    # ======================================
    # TREE VISUAL AREA
    # ======================================

    tree_area = document.createElement(
        "div"
    )

    tree_area.className = (
        "relative w-full "
        "overflow-x-auto "
        "pb-4"
    )


    # ======================================
    # TREE CONTAINER
    # ======================================

    tree = document.createElement(
        "div"
    )

    tree.className = (
        "relative "
        "min-w-[620px] "
        "h-[270px] "
        "mx-auto"
    )


    # ======================================
    # SVG CONNECTOR LINES
    # ======================================

    svg = document.createElement(
        "svg"
    )

    svg.setAttribute(
        "viewBox",
        "0 0 1000 270"
    )

    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    )

    svg.className = (
        "absolute inset-0 "
        "w-full h-full "
        "pointer-events-none"
    )


    def add_line(x1, y1, x2, y2):

        line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        )

        line.setAttribute(
            "x1", str(x1)
        )

        line.setAttribute(
            "y1", str(y1)
        )

        line.setAttribute(
            "x2", str(x2)
        )

        line.setAttribute(
            "y2", str(y2)
        )

        line.setAttribute(
            "stroke",
            "#000000"
        )

        line.setAttribute(
            "stroke-width",
            "8"
        )

        svg.appendChild(line)


    # Seed → Fruits
    add_line(500, 45, 250, 120)

    # Seed → Vegetables
    add_line(500, 45, 750, 120)

    # Fruits → Strawberry
    add_line(250, 145, 150, 220)

    # Fruits → Orange
    add_line(250, 145, 350, 220)

    # Vegetables → Tomato
    add_line(750, 145, 550, 220)

    # Vegetables → Carrot
    add_line(750, 145, 700, 220)

    # Vegetables → Ginger
    add_line(750, 145, 850, 220)


    tree.appendChild(svg)


    # ======================================
    # SEED
    # ======================================

    seed_button = create_node_button(seed)

    seed_wrapper = document.createElement("div")

    seed_wrapper.className = (
        "absolute "
        "top-0 left-1/2 "
        "-translate-x-1/2"
    )

    seed_wrapper.appendChild(seed_button)

    tree.appendChild(seed_wrapper)


    # ======================================
    # FRUITS
    # ======================================

    fruits_button = create_node_button(fruits)
    fruits_button.id = "fruits-button"

    fruits_wrapper = document.createElement("div")

    fruits_wrapper.className = (
        "absolute "
        "top-[82px] left-[25%] "
        "-translate-x-1/2"
    )

    fruits_wrapper.appendChild(fruits_button)

    tree.appendChild(fruits_wrapper)


    # ======================================
    # VEGETABLES
    # ======================================

    vegetables_button = create_node_button(
        vegetables
    )

    vegetables_button.id = "vegetables-button"

    vegetables_wrapper = document.createElement("div")

    vegetables_wrapper.className = (
        "absolute "
        "top-[82px] left-[75%] "
        "-translate-x-1/2"
    )

    vegetables_wrapper.appendChild(
        vegetables_button
    )

    tree.appendChild(
        vegetables_wrapper
    )


    # ======================================
    # STRAWBERRY
    # ======================================

    strawberry_button = create_node_button(
        strawberry
    )

    strawberry_button.id = (
        "strawberry-button"
    )

    strawberry_wrapper = document.createElement("div")

    strawberry_wrapper.className = (
        "absolute "
        "top-[190px] left-[15%] "
        "-translate-x-1/2"
    )

    strawberry_wrapper.appendChild(
        strawberry_button
    )

    tree.appendChild(
        strawberry_wrapper
    )


    # ======================================
    # ORANGE
    # ======================================

    orange_button = create_node_button(
        orange
    )

    orange_button.id = "orange-button"

    orange_wrapper = document.createElement("div")

    orange_wrapper.className = (
        "absolute "
        "top-[190px] left-[35%] "
        "-translate-x-1/2"
    )

    orange_wrapper.appendChild(
        orange_button
    )

    tree.appendChild(
        orange_wrapper
    )


    # ======================================
    # TOMATO
    # ======================================

    tomato_button = create_node_button(
        tomato
    )

    tomato_button.id = "tomato-button"

    tomato_wrapper = document.createElement("div")

    tomato_wrapper.className = (
        "absolute "
        "top-[190px] left-[55%] "
        "-translate-x-1/2"
    )

    tomato_wrapper.appendChild(
        tomato_button
    )

    tree.appendChild(
        tomato_wrapper
    )


    # ======================================
    # CARROT
    # ======================================

    carrot_button = create_node_button(
        carrot
    )

    carrot_button.id = "carrot-button"

    carrot_wrapper = document.createElement("div")

    carrot_wrapper.className = (
        "absolute "
        "top-[190px] left-[70%] "
        "-translate-x-1/2"
    )

    carrot_wrapper.appendChild(
        carrot_button
    )

    tree.appendChild(
        carrot_wrapper
    )


    # ======================================
    # GINGER
    # ======================================

    ginger_button = create_node_button(
        ginger
    )

    ginger_button.id = "ginger-button"

    ginger_wrapper = document.createElement("div")

    ginger_wrapper.className = (
        "absolute "
        "top-[190px] left-[85%] "
        "-translate-x-1/2"
    )

    ginger_wrapper.appendChild(
        ginger_button
    )

    tree.appendChild(
        ginger_wrapper
    )


    tree_area.appendChild(tree)
    panel.appendChild(tree_area)


    # ======================================
    # SELECTED TRAVERSAL
    # ======================================

    traversal_label = document.createElement("div")

    traversal_label.className = (
        "text-sm text-gray-300 "
        "mt-2 mb-2"
    )

    traversal_label.textContent = (
        "Selected Traversal:"
    )

    panel.appendChild(
        traversal_label
    )


    traversal_select = document.createElement("select")

    traversal_select.id = (
        "garden-traversal"
    )

    traversal_select.className = (
        "w-full bg-[#202938] "
        "border border-gray-600 "
        "text-white rounded-lg "
        "px-4 py-3"
    )


    for traversal in [
        "BFS",
        "Preorder",
        "Inorder",
        "Postorder"
    ]:

        option = document.createElement("option")

        option.value = traversal
        option.textContent = traversal

        traversal_select.appendChild(option)


    traversal_callback = create_proxy(
        change_traversal
    )

    traversal_select.addEventListener(
        "change",
        traversal_callback
    )

    tree_proxies.append(
        traversal_callback
    )

    panel.appendChild(
        traversal_select
    )


    # ======================================
    # RUN TRAVERSAL
    # ======================================

    run_button = document.createElement("button")

    run_button.className = (
        "w-full mt-3 px-4 py-3 "
        "rounded-lg "
        "bg-blue-600 "
        "hover:bg-blue-500 "
        "text-white font-bold"
    )

    run_button.textContent = (
        "🔄 Run Traversal"
    )


    def run_selected_traversal(event):

        nodes = get_traversal()

        order = []

        for node in nodes:

            order.append(
                f"{node.emoji} {node.name}"
            )

        display_output(
            f"<b>{selected_traversal}:</b> "
            + " → ".join(order)
        )


    run_callback = create_proxy(
        run_selected_traversal
    )

    run_button.addEventListener(
        "click",
        run_callback
    )

    tree_proxies.append(
        run_callback
    )

    panel.appendChild(
        run_button
    )


    # ======================================
    # GARDEN ACTIONS
    # ======================================

    action_label = document.createElement("div")

    action_label.className = (
        "text-sm text-gray-300 "
        "mt-5 mb-2"
    )

    action_label.textContent = (
        "Garden Actions:"
    )

    panel.appendChild(
        action_label
    )


    action_container = document.createElement("div")

    action_container.className = (
        "grid grid-cols-3 gap-2"
    )

    panel.appendChild(
        action_container
    )


    # ======================================
    # PLANT BUTTON
    # ======================================

    plant_button = document.createElement("button")

    plant_button.id = "plant-action-button"

    plant_button.className = (
        "bg-green-700 "
        "hover:brightness-110 "
        "text-white font-bold "
        "px-3 py-3 rounded-lg"
    )

    plant_button.textContent = "🌱 Plant"


    plant_callback = create_proxy(
        lambda event:
        perform_action("Plant")
    )

    plant_button.addEventListener(
        "click",
        plant_callback
    )

    tree_proxies.append(
        plant_callback
    )

    action_container.appendChild(
        plant_button
    )


    # ======================================
    # WATER BUTTON
    # ======================================

    water_button = document.createElement("button")

    water_button.id = "water-action-button"

    water_button.className = (
        "bg-blue-700 "
        "hover:brightness-110 "
        "text-white font-bold "
        "px-3 py-3 rounded-lg"
    )

    water_button.textContent = "💧 Water"


    water_callback = create_proxy(
        lambda event:
        perform_action("Water")
    )

    water_button.addEventListener(
        "click",
        water_callback
    )

    tree_proxies.append(
        water_callback
    )

    action_container.appendChild(
        water_button
    )

    # Buy water: 50 L for 20 coins.
    buy_water_button = document.createElement("button")
    buy_water_button.id = "buy-water-button"
    buy_water_button.className = "bg-amber-700 hover:brightness-110 text-white font-bold px-3 py-3 rounded-lg"
    buy_water_button.textContent = "🛒 Buy Water (-20 coins)"
    buy_water_button.style.display = "none"
    buy_water_callback = create_proxy(lambda event: garden.buy_water())
    buy_water_button.addEventListener("click", buy_water_callback)
    tree_proxies.append(buy_water_callback)
    action_container.appendChild(buy_water_button)


    # ======================================
    # STATUS
    # ======================================

    status = document.createElement("div")

    status.id = "tree-status"

    status.className = (
        "mt-4 p-3 rounded-lg "
        "bg-[#0d160e] "
        "text-emerald-300 text-sm"
    )

    status.textContent = (
        "🌱 Click Seed to begin."
    )

    panel.appendChild(status)


    # ======================================
    # OUTPUT
    # ======================================

    output_label = document.createElement("div")

    output_label.className = (
        "text-sm text-gray-300 "
        "mt-4 mb-2"
    )

    output_label.textContent = "Output:"

    panel.appendChild(output_label)


    output = document.createElement("div")

    output.id = "tree-output"

    output.className = (
        "bg-black/50 "
        "border border-emerald-900 "
        "rounded-xl "
        "p-3 "
        "text-sm "
        "min-h-[45px] "
        "font-mono"
    )

    panel.appendChild(output)


    # ======================================
    # INITIAL STATE
    # ======================================

    hide_all_choices()

    # Only Seed is visible initially.
    # Fruits/Vegetables and specific plants are hidden.


    # ======================================
    # ADD PANEL BELOW GARDEN GRID
    # ======================================

    game.appendChild(panel)


# ==========================================
# START
# ==========================================

create_tree_ui()

print("Click seed and choose a plant (Fruit or Vegetable).")


`
            },
            5: {
                title: "TOPIC 5: Binary Search Trees (BST) & Node Mutation",
                code: `# Topic 5: Binary Search Trees (BST) & Node Mutation
from js import document
from pyodide.ffi import create_proxy

# Plant values used as the BST key.
PLANT_VALUES = {
    "Strawberry": 20,
    "Orange": 10,
    "Tomato": 15,
    "Carrot": 12,
    "Ginger": 8
}
PLANT_EMOJIS = {
    "Strawberry": "🍓",
    "Orange": "🍊",
    "Tomato": "🍅",
    "Carrot": "🥕",
    "Ginger": "🫚"
}

class BSTNode:
    def __init__(self, plant_id, name, value):
        self.plant_id = plant_id
        self.name = name
        self.value = value
        self.left = None
        self.right = None

class PlantBST:
    def __init__(self):
        self.root = None

    def key(self, node):
        return (node.value, node.plant_id)

    def insert(self, plant_id, name, value):
        item = BSTNode(plant_id, name, value)
        self.root = self._insert(self.root, item)

    def _insert(self, current, item):
        if current is None:
            return item
        if self.key(item) < self.key(current):
            current.left = self._insert(current.left, item)
        elif self.key(item) > self.key(current):
            current.right = self._insert(current.right, item)
        return current

    def search(self, value, plant_id):
        target = (value, plant_id)
        current = self.root
        while current is not None:
            current_key = self.key(current)
            if target == current_key:
                return current
            current = current.left if target < current_key else current.right
        return None

    def delete(self, value, plant_id):
        self.root, deleted = self._delete(self.root, (value, plant_id))
        return deleted

    def _delete(self, current, target):
        if current is None:
            return None, False
        current_key = self.key(current)
        if target < current_key:
            current.left, deleted = self._delete(current.left, target)
            return current, deleted
        if target > current_key:
            current.right, deleted = self._delete(current.right, target)
            return current, deleted
        if current.left is None:
            return current.right, True
        if current.right is None:
            return current.left, True
        successor = current.right
        while successor.left is not None:
            successor = successor.left
        current.plant_id = successor.plant_id
        current.name = successor.name
        current.value = successor.value
        current.right, _ = self._delete(
            current.right, (successor.value, successor.plant_id)
        )
        return current, True

    def inorder(self):
        result = []
        def walk(node):
            if node is None:
                return
            walk(node.left)
            result.append(node)
            walk(node.right)
        walk(self.root)
        return result

bst = PlantBST()
bst_values = {}
bst_callbacks = []

# Create or reuse the BST panel immediately after the Hierarchical Garden Tree.
game = document.getElementById("view-game")
tree_panel = document.getElementById("hierarchical-tree-panel")
if game is None:
    print("ERROR: Game panel was not found. Run Topic 4 first.")
else:
    old_panel = document.getElementById("binary-search-tree-panel")
    if old_panel:
        old_panel.remove()

    bst_panel = document.createElement("div")
    bst_panel.id = "binary-search-tree-panel"
    bst_panel.className = "mt-4 p-4 rounded-2xl bg-[#172017] border border-emerald-700"

    heading = document.createElement("h3")
    heading.className = "text-lg font-bold text-emerald-300"
    heading.textContent = "🌳 Binary Search Tree (BST)"
    bst_panel.appendChild(heading)

    description = document.createElement("p")
    description.className = "text-xs text-gray-400 mt-1 mb-3"
    description.textContent = "Plants from the garden grid, ordered by value (lowest to highest)."
    bst_panel.appendChild(description)

    tree_area = document.createElement("div")
    tree_area.id = "bst-tree-area"
    tree_area.className = "w-full overflow-x-auto rounded-lg bg-[#0d160f] p-2"
    bst_panel.appendChild(tree_area)

    controls = document.createElement("div")
    controls.className = "grid grid-cols-1 gap-2 mt-3"
    bst_panel.appendChild(controls)

    search_row = document.createElement("div")
    search_row.className = "grid grid-cols-2 gap-2"
    search_input = document.createElement("input")
    search_input.id = "bst-search-id"
    search_input.type = "number"
    search_input.min = "1"
    search_input.max = "25"
    search_input.placeholder = "Tile ID (1–25)"
    search_input.className = "min-w-0 bg-[#202938] border border-gray-600 rounded-lg px-2 py-2 text-sm text-white"
    search_row.appendChild(search_input)

    search_button = document.createElement("button")
    search_button.textContent = "🔎 Search"
    search_button.className = "rounded-lg bg-blue-700 hover:bg-blue-600 px-3 py-2 text-sm font-bold text-white"
    search_row.appendChild(search_button)
    controls.appendChild(search_row)

    update_row = document.createElement("div")
    update_row.className = "grid grid-cols-3 gap-2"
    update_id = document.createElement("input")
    update_id.id = "bst-update-id"
    update_id.type = "number"
    update_id.min = "1"
    update_id.max = "25"
    update_id.placeholder = "Tile ID"
    update_id.className = "min-w-0 bg-[#202938] border border-gray-600 rounded-lg px-2 py-2 text-sm text-white"
    update_row.appendChild(update_id)

    update_value = document.createElement("input")
    update_value.id = "bst-update-value"
    update_value.type = "number"
    update_value.placeholder = "New value"
    update_value.className = "min-w-0 bg-[#202938] border border-gray-600 rounded-lg px-2 py-2 text-sm text-white"
    update_row.appendChild(update_value)

    update_button = document.createElement("button")
    update_button.textContent = "✏️ Update"
    update_button.className = "rounded-lg bg-amber-700 hover:bg-amber-600 px-2 py-2 text-xs font-bold text-white"
    update_row.appendChild(update_button)
    controls.appendChild(update_row)

    delete_row = document.createElement("div")
    delete_row.className = "grid grid-cols-2 gap-2"
    delete_input = document.createElement("input")
    delete_input.id = "bst-delete-id"
    delete_input.type = "number"
    delete_input.min = "1"
    delete_input.max = "25"
    delete_input.placeholder = "Tile ID to delete"
    delete_input.className = "min-w-0 bg-[#202938] border border-gray-600 rounded-lg px-2 py-2 text-sm text-white"
    delete_row.appendChild(delete_input)

    delete_button = document.createElement("button")
    delete_button.textContent = "🗑 Delete BST Entry"
    delete_button.className = "rounded-lg bg-red-800 hover:bg-red-700 px-2 py-2 text-xs font-bold text-white"
    delete_row.appendChild(delete_button)
    controls.appendChild(delete_row)

    sync_button = document.createElement("button")
    sync_button.textContent = "🔄 Sync with Garden Grid"
    sync_button.className = "w-full rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-2 text-sm font-bold text-white"
    controls.appendChild(sync_button)

    status = document.createElement("div")
    status.id = "bst-status"
    status.className = "mt-3 rounded-lg bg-black/40 border border-emerald-900 p-3 text-xs text-emerald-200"
    status.textContent = "Ready. Plant crops in the grid, then click Sync with Garden Grid."
    bst_panel.appendChild(status)

    if tree_panel and tree_panel.parentElement:
        tree_panel.parentElement.insertBefore(bst_panel, tree_panel.nextSibling)
    else:
        game.appendChild(bst_panel)

    def set_status(message):
        status.textContent = message

    def current_garden_plants():
        found = []
        if "garden" not in globals() or not hasattr(garden, "grid"):
            return found
        for r, row in enumerate(garden.grid):
            for c, name in enumerate(row):
                if name in PLANT_VALUES:
                    tile_id = r * 5 + c + 1
                    key = (tile_id, name)
                    value = bst_values.get(key, PLANT_VALUES[name])
                    found.append((tile_id, name, value))
        return found

    def render_bst():
        tree_area.replaceChildren()
        nodes = bst.inorder()
        if not nodes:
            empty = document.createElement("p")
            empty.className = "text-xs text-gray-400 p-2"
            empty.textContent = "BST is empty. Plant crops, then sync the garden."
            tree_area.appendChild(empty)
            return

        # SVG tree keeps parent-child connectors aligned with the nodes.
        width = max(320, len(nodes) * 110)
        positions = {}
        def layout(node, depth=0, x_counter=None):
            if x_counter is None:
                x_counter = [0]
            if node is None:
                return
            layout(node.left, depth + 1, x_counter)
            positions[node.plant_id] = (x_counter[0] * 100 + 55, depth * 82 + 35)
            x_counter[0] += 1
            layout(node.right, depth + 1, x_counter)
        layout(bst.root)
        max_depth = max(y for x, y in positions.values())
        height = max(100, max_depth + 55)

        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", str(max(width, max(x for x, y in positions.values()) + 55)))
        svg.setAttribute("height", str(height))
        svg.setAttribute("viewBox", "0 0 {} {}".format(max(width, max(x for x, y in positions.values()) + 55), height))
        svg.setAttribute("role", "img")
        svg.setAttribute("aria-label", "Binary search tree of garden plants")

        def draw_edges(node):
            if node is None:
                return
            x1, y1 = positions[node.plant_id]
            for child in (node.left, node.right):
                if child is not None:
                    x2, y2 = positions[child.plant_id]
                    line = document.createElementNS("http://www.w3.org/2000/svg", "line")
                    line.setAttribute("x1", str(x1))
                    line.setAttribute("y1", str(y1 + 18))
                    line.setAttribute("x2", str(x2))
                    line.setAttribute("y2", str(y2 - 18))
                    line.setAttribute("stroke", "#34d399")
                    line.setAttribute("stroke-width", "2")
                    svg.appendChild(line)
            draw_edges(node.left)
            draw_edges(node.right)
        draw_edges(bst.root)

        for node in nodes:
            x, y = positions[node.plant_id]
            group = document.createElementNS("http://www.w3.org/2000/svg", "g")
            circle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
            circle.setAttribute("x", str(x - 43))
            circle.setAttribute("y", str(y - 18))
            circle.setAttribute("width", "86")
            circle.setAttribute("height", "38")
            circle.setAttribute("rx", "9")
            circle.setAttribute("fill", "#14532d")
            circle.setAttribute("stroke", "#34d399")
            circle.setAttribute("stroke-width", "1.5")
            group.appendChild(circle)

            label = document.createElementNS("http://www.w3.org/2000/svg", "text")
            label.setAttribute("x", str(x))
            label.setAttribute("y", str(y - 2))
            label.setAttribute("text-anchor", "middle")
            label.setAttribute("font-size", "10")
            label.setAttribute("font-weight", "700")
            label.setAttribute("fill", "#ecfdf5")
            label.textContent = "{} {}".format(PLANT_EMOJIS.get(node.name, "🌱"), node.value)
            group.appendChild(label)

            id_label = document.createElementNS("http://www.w3.org/2000/svg", "text")
            id_label.setAttribute("x", str(x))
            id_label.setAttribute("y", str(y + 12))
            id_label.setAttribute("text-anchor", "middle")
            id_label.setAttribute("font-size", "8")
            id_label.setAttribute("fill", "#d1fae5")
            id_label.textContent = "Tile {}".format(node.plant_id)
            group.appendChild(id_label)
            svg.appendChild(group)
        tree_area.appendChild(svg)

    def sync_bst(event=None):
        global bst
        bst = PlantBST()
        plants = current_garden_plants()
        for tile_id, name, value in plants:
            bst.insert(tile_id, name, value)
        render_bst()
        set_status("Synced with garden: {} plant(s). In-order values are sorted from low to high.".format(len(plants)))

    def do_search(event=None):
        try:
            tile_id = int(search_input.value)
        except (TypeError, ValueError):
            set_status("Enter a valid tile ID from 1 to 25.")
            return
        found = None
        for item in bst.inorder():
            if item.plant_id == tile_id:
                found = item
                break
        if found is None:
            set_status("No BST entry found for tile {}.".format(tile_id))
        else:
            result = bst.search(found.value, found.plant_id)
            set_status("Found: {} {} | value {} | tile {}.".format(PLANT_EMOJIS.get(result.name, "🌱"), result.name, result.value, result.plant_id))

    def do_update(event=None):
        try:
            tile_id = int(update_id.value)
            new_value = int(update_value.value)
        except (TypeError, ValueError):
            set_status("Enter a valid tile ID and numeric value.")
            return
        target = None
        for item in bst.inorder():
            if item.plant_id == tile_id:
                target = item
                break
        if target is None:
            set_status("Cannot update: tile {} is not in the BST.".format(tile_id))
            return
        name = target.name
        bst.delete(target.value, target.plant_id)
        bst_values[(tile_id, name)] = new_value
        bst.insert(tile_id, name, new_value)
        render_bst()
        set_status("Updated {} at tile {} to value {}. The node was reinserted to preserve BST order.".format(name, tile_id, new_value))

    def do_delete(event=None):
        try:
            tile_id = int(delete_input.value)
        except (TypeError, ValueError):
            set_status("Enter a valid tile ID from 1 to 25.")
            return
        target = None
        for item in bst.inorder():
            if item.plant_id == tile_id:
                target = item
                break
        if target is None:
            set_status("Cannot delete: tile {} is not in the BST.".format(tile_id))
            return
        bst.delete(target.value, target.plant_id)
        render_bst()
        set_status("Deleted tile {} from the BST index only. The plant remains in the garden; click Sync to rebuild the index.".format(tile_id))

    for button, callback in (
        (search_button, do_search),
        (update_button, do_update),
        (delete_button, do_delete),
        (sync_button, sync_bst)
    ):
        proxy = create_proxy(callback)
        bst_callbacks.append(proxy)
        button.addEventListener("click", proxy)

    sync_bst()
    print("BST panel added directly below Hierarchical Garden Tree.")
    print("Search/Update use tile IDs 1–25. Delete removes an index entry only.")
    print("Search, insert, delete: O(log n) average, O(n) worst case; traversal: O(n).")
`
            },
            6: {
                title: "TOPIC 6: Sorting Algorithms",
                code: `# Topic 6: Animated Bubble Sort and Selection Sort
# These functions use the SAME garden.harvested_crops list created by Topic 3.
import json

if "garden" not in globals() or not hasattr(garden, "harvested_crops"):
    print("Run Topic 3 first to initialize the garden and harvest some crops.")
else:
    def refresh_harvest_inventory(sort_label="Harvest order"):
        rows = [[c["id"], c["name"], c["weight"], c["selling_value"]]
                for c in garden.harvested_crops]
        updateHarvestInventory(rows, sort_label)

    def bubble_sort_by_weight(crops):
        # Bubble Sort: compare adjacent weights and swap if needed.
        steps = []
        n = len(crops)
        steps.append({"ids": [c["id"] for c in crops], "compare": [], "sorted_from": n, "note": "Starting Bubble Sort by weight."})
        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                steps.append({"ids": [c["id"] for c in crops], "compare": [j, j + 1], "sorted_from": n - i, "note": "Compare adjacent weights: {} and {}.".format(crops[j]["name"], crops[j + 1]["name"])})
                if crops[j]["weight"] > crops[j + 1]["weight"]:
                    crops[j], crops[j + 1] = crops[j + 1], crops[j]
                    swapped = True
                    steps.append({"ids": [c["id"] for c in crops], "compare": [j, j + 1], "sorted_from": n - i, "note": "Swap! The lighter crop moves left."})
            if not swapped:
                break
        steps.append({"ids": [c["id"] for c in crops], "compare": [], "sorted_from": 0, "note": "Bubble Sort complete: lightest to heaviest."})
        return steps

    def selection_sort_by_selling_value(crops):
        # Selection Sort: find the lowest selling value in each unsorted section.
        steps = []
        n = len(crops)
        steps.append({"ids": [c["id"] for c in crops], "compare": [], "minimum": None, "sorted_to": 0, "note": "Starting Selection Sort by selling value."})
        for i in range(n):
            min_index = i
            for j in range(i + 1, n):
                steps.append({"ids": [c["id"] for c in crops], "compare": [j], "minimum": min_index, "sorted_to": i, "note": "Compare {} with the current minimum {}.".format(crops[j]["name"], crops[min_index]["name"])})
                if crops[j]["selling_value"] < crops[min_index]["selling_value"]:
                    min_index = j
                    steps.append({"ids": [c["id"] for c in crops], "compare": [j], "minimum": min_index, "sorted_to": i, "note": "New minimum: {}.".format(crops[min_index]["name"])})
            if min_index != i:
                crops[i], crops[min_index] = crops[min_index], crops[i]
                steps.append({"ids": [c["id"] for c in crops], "compare": [i, min_index], "minimum": None, "sorted_to": i + 1, "note": "Place the lowest-value crop at position {}.".format(i + 1)})
        steps.append({"ids": [c["id"] for c in crops], "compare": [], "minimum": None, "sorted_to": n, "note": "Selection Sort complete: lowest to highest selling value."})
        return steps

    def sort_harvested_by_weight():
        if not garden.harvested_crops:
            refresh_harvest_inventory("No harvested crops yet")
            print("Inventory is empty. Harvest crops in Topic 3 first.")
            return "[]"
        steps = bubble_sort_by_weight(garden.harvested_crops)
        refresh_harvest_inventory("Bubble Sort: lightest to heaviest")
        print("Bubble Sort result:", [(c["name"], c["weight"]) for c in garden.harvested_crops])
        print("Time: O(n^2) average/worst, O(n) best with early stop; Space: O(1) excluding animation steps.")
        return json.dumps(steps)

    def sort_harvested_by_selling_value():
        if not garden.harvested_crops:
            refresh_harvest_inventory("No harvested crops yet")
            print("Inventory is empty. Harvest crops in Topic 3 first.")
            return "[]"
        steps = selection_sort_by_selling_value(garden.harvested_crops)
        refresh_harvest_inventory("Selection Sort: lowest to highest value")
        print("Selection Sort result:", [(c["name"], c["selling_value"]) for c in garden.harvested_crops])
        print("Time: O(n^2) best/average/worst; Space: O(1) excluding animation steps.")
        return json.dumps(steps)

    refresh_harvest_inventory()
    print("Topic 6 ready: animated sorting uses the actual garden.harvested_crops records.")
    print("Newly harvested crops automatically appear in this same inventory.")
`
            },
            7: {
                title: "TOPIC 7: Hash Tables, Collisions, & Rehashing",
                code: `# Topic 7: Hash Tables, Collisions, & Rehashing
# Uses the SAME garden.grid created by Topic 3. No duplicate inventory is created.
from js import document
from pyodide.ffi import create_proxy

if "garden" not in globals() or not hasattr(garden, "grid"):
    print("Run Topic 3 first. Topic 7 reads the existing garden.grid.")
else:
    class HashTable:
        """Hash table using Separate Chaining (a list in each bucket)."""

        def __init__(self, capacity=5, max_load_factor=0.75):
            self.capacity = max(3, capacity)
            self.max_load_factor = max_load_factor
            self.buckets = [[] for _ in range(self.capacity)]
            self.size = 0

        def _hash(self, key):
            # Stable beginner-friendly hash for plot IDs such as '1' or '2'.
            return sum(ord(char) for char in str(key)) % self.capacity

        def _find_entry(self, key):
            index = self._hash(key)
            for entry in self.buckets[index]:
                if entry["key"] == str(key):
                    return index, entry
            return index, None

        def insert(self, key, value):
            key = str(key)
            index, existing = self._find_entry(key)
            if existing is not None:
                existing["value"] = value
                return "updated"
            self.buckets[index].append({"key": key, "value": value})
            self.size += 1
            if self.load_factor() > self.max_load_factor:
                self.rehash()
            return "inserted"

        def search(self, key):
            _, entry = self._find_entry(key)
            return None if entry is None else entry["value"]

        def update(self, key, value):
            _, entry = self._find_entry(key)
            if entry is None:
                return False
            entry["value"] = value
            return True

        def delete(self, key):
            index, entry = self._find_entry(key)
            if entry is None:
                return False
            self.buckets[index].remove(entry)
            self.size -= 1
            return True

        def load_factor(self):
            return self.size / self.capacity

        def rehash(self):
            old_entries = []
            for bucket in self.buckets:
                old_entries.extend(bucket)
            self.capacity = self.capacity * 2
            self.buckets = [[] for _ in range(self.capacity)]
            for entry in old_entries:
                new_index = self._hash(entry["key"])
                self.buckets[new_index].append(entry)
            print("Rehash completed. New capacity:", self.capacity)

        def all_entries(self):
            return [entry for bucket in self.buckets for entry in bucket]

    # Reuse an existing table if Topic 7 is run again.
    if "plant_hash_table" not in globals():
        plant_hash_table = HashTable()

    hash_callbacks = []

    # Create the Topic 7 display inside Interactive Sanctuary.
    game_view = document.getElementById("view-game")
    old_hash_panel = document.getElementById("plant-hash-panel")
    if old_hash_panel:
        old_hash_panel.remove()

    panel = document.createElement("section")
    panel.id = "plant-hash-panel"
    panel.className = "mt-4 p-4 rounded-2xl bg-[#172017] border border-cyan-800"

    heading = document.createElement("h3")
    heading.className = "text-lg font-bold text-cyan-200"
    heading.textContent = "🔎 Fast Plant Lookup — Hash Table"
    panel.appendChild(heading)

    description = document.createElement("p")
    description.className = "text-xs text-emerald-300/80 mt-1 mb-3"
    description.textContent = "Live index of the plants in your actual 5×5 garden. Key = plot/tile ID; value = plant details."
    panel.appendChild(description)

    stats = document.createElement("div")
    stats.id = "plant-hash-stats"
    stats.className = "rounded-lg bg-black/30 border border-cyan-900 p-3 text-xs text-cyan-100 mb-3"
    panel.appendChild(stats)

    search_row = document.createElement("div")
    search_row.className = "grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3"
    search_input = document.createElement("input")
    search_input.id = "plant-hash-search"
    search_input.type = "number"
    search_input.min = "1"
    search_input.max = "25"
    search_input.placeholder = "Enter tile ID (1–25)"
    search_input.className = "min-w-0 rounded-lg bg-[#0d160f] border border-emerald-800 px-3 py-2 text-sm text-white"
    search_row.appendChild(search_input)

    search_button = document.createElement("button")
    search_button.textContent = "🔍 Search Plant"
    search_button.className = "rounded-lg bg-cyan-800 hover:bg-cyan-700 px-3 py-2 text-xs font-bold text-white"
    search_row.appendChild(search_button)

    sync_button = document.createElement("button")
    sync_button.textContent = "↻ Sync Garden"
    sync_button.className = "rounded-lg bg-emerald-800 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
    search_row.appendChild(sync_button)
    panel.appendChild(search_row)

    result_box = document.createElement("div")
    result_box.id = "plant-hash-result"
    result_box.className = "rounded-lg bg-black/30 border border-emerald-900 p-3 text-xs text-emerald-100 mb-3"
    result_box.textContent = "Search a tile ID to retrieve its plant record."
    panel.appendChild(result_box)

    bucket_heading = document.createElement("h4")
    bucket_heading.className = "text-sm font-bold text-cyan-200 mb-2"
    bucket_heading.textContent = "Hash Table Buckets (Separate Chaining)"
    panel.appendChild(bucket_heading)

    bucket_area = document.createElement("div")
    bucket_area.id = "plant-hash-buckets"
    bucket_area.className = "grid grid-cols-1 sm:grid-cols-2 gap-2"
    panel.appendChild(bucket_area)

    explanation = document.createElement("p")
    explanation.className = "text-[11px] text-emerald-300/80 mt-3 leading-relaxed"
    explanation.textContent = "Collision: different tile IDs can map to the same bucket. Chaining keeps both records in that bucket. Rehashing doubles capacity when load factor exceeds 0.75."
    panel.appendChild(explanation)

    game_view.appendChild(panel)

    def sync_plant_hash_table():
        """Rebuild the index from Topic 3's current grid, preserving plant data."""
        global plant_hash_table
        fresh = HashTable(capacity=max(5, plant_hash_table.capacity))
        for row_index, row in enumerate(garden.grid):
            for col_index, plant_name in enumerate(row):
                if plant_name is not None:
                    tile_id = row_index * len(row) + col_index + 1
                    growth_stage = garden.growth[row_index][col_index]
                    record = {
                        "plant_id": tile_id,
                        "name": plant_name,
                        "water_level": growth_stage * 10,
                        "growth_status": ["Seed", "Growing", "Ready to harvest"][growth_stage]
                    }
                    fresh.insert(str(tile_id), record)
        plant_hash_table = fresh
        render_plant_hash_table()

    def render_plant_hash_table():
        bucket_area.replaceChildren()
        stats.textContent = "Plants: {} | Capacity: {} | Load factor: {:.2f} / {:.2f}".format(
            plant_hash_table.size,
            plant_hash_table.capacity,
            plant_hash_table.load_factor(),
            plant_hash_table.max_load_factor
        )
        for index, bucket in enumerate(plant_hash_table.buckets):
            card = document.createElement("div")
            card.className = "rounded-lg border border-emerald-900 bg-[#0d160f] p-3 min-w-0"
            label = document.createElement("div")
            label.className = "text-[11px] font-bold text-cyan-300 mb-2"
            label.textContent = "Bucket {} · Index {}".format(index, index)
            card.appendChild(label)
            if not bucket:
                empty = document.createElement("div")
                empty.className = "text-[11px] text-gray-500"
                empty.textContent = "Empty"
                card.appendChild(empty)
            else:
                for entry in bucket:
                    value = entry["value"]
                    item = document.createElement("div")
                    item.className = "rounded-md bg-emerald-950/70 border border-emerald-800 px-2 py-2 mb-1 text-[11px] text-emerald-100"
                    item.textContent = "Tile {} → {} | Water: {} L | Status: {}".format(
                        entry["key"], value["name"], value["water_level"], value["growth_status"]
                    )
                    card.appendChild(item)
                if len(bucket) > 1:
                    collision = document.createElement("div")
                    collision.className = "text-[10px] text-amber-300 mt-1"
                    collision.textContent = "⚡ Collision handled by chaining ({} records)".format(len(bucket))
                    card.appendChild(collision)
            bucket_area.appendChild(card)

    def search_plant(event=None):
        try:
            tile_id = int(search_input.value)
        except (TypeError, ValueError):
            result_box.textContent = "Enter a valid tile ID from 1 to 25."
            return
        record = plant_hash_table.search(str(tile_id))
        if record is None:
            result_box.textContent = "No plant found at tile {}. Empty or missing keys are handled safely.".format(tile_id)
        else:
            result_box.textContent = "FOUND — Tile {}: {} | Water level: {} L | Growth: {}".format(
                tile_id, record["name"], record["water_level"], record["growth_status"]
            )

    def sync_button_click(event=None):
        sync_plant_hash_table()
        result_box.textContent = "Hash Table synchronized with the current garden grid."

    for button, callback in ((search_button, search_plant), (sync_button, sync_button_click)):
        proxy = create_proxy(callback)
        hash_callbacks.append(proxy)
        button.addEventListener("click", proxy)

    sync_plant_hash_table()

    # Demonstrate collision and rehash behavior without adding fake garden plants.
    print("Hash Table ready: indexed {} actual garden plant(s).".format(plant_hash_table.size))
    print("Key: tile ID | Value: plant name, water level, and growth status.")
    print("Collision resolution: Separate Chaining (each bucket stores a list).")
    print("Rehash threshold: load factor > 0.75; capacity doubles and all entries are redistributed.")
    print("Operations: insert/search/update/delete; garden changes automatically rebuild the index.")
    print("Big O: average insert/search/update/delete O(1); worst case O(n); rehash O(n).")
`
            },
            
        };




        async function initPyodide() {
            const consoleEl = document.getElementById("output-console");
            if (pyodideInstance) return;
            if (consoleEl) {
                consoleEl.innerHTML = `<span class="text-amber-400">Loading Python...</span><br>`;
            }
            try {
                pyodideInstance = await loadPyodide();
                // Bridge functions Python may call (pure display — no game rules)
                pyodideInstance.globals.set("addPlantToGrid", addPlantToGrid);
                pyodideInstance.globals.set("updateResources", updateResources);
                pyodideInstance.globals.set("addPlantsToDropdown", addPlantsToDropdown);
                pyodideInstance.globals.set("pushAction", pushAction);
                pyodideInstance.globals.set("updateClimateQueue", updateClimateQueue);
                pyodideInstance.globals.set("updateHarvestInventory", updateHarvestInventory);
                await pyodideInstance.runPythonAsync(`
import sys
import js
from js import document
class Console:
    def write(self, text):
        if text and text.strip():
            el = document.getElementById("output-console")
            if el:
                el.innerHTML += text.replace("\\n", "<br>")
    def flush(self): pass
sys.stdout = Console()
                `);
                if (consoleEl) {
                    consoleEl.innerHTML = `<span class="text-emerald-400">Python ready.</span><br>`;
                }
            } catch (err) {
                if (consoleEl) {
                    consoleEl.innerHTML = `<span class="text-red-400">Failed to load Python: ${err.message}</span>`;
                }
                throw err;
            }
        }




        // ---- Pure display bridges (called from Python) ----




        // updateClimateQueue(events, activeHazard)
        // Python owns FIFO state. This bridge only renders pending and active hazards.
        function updateClimateQueue(events, activeHazard = null) {
            const container = document.getElementById("climate-queue");
            const indicator = document.getElementById("active-hazard-indicator");
            const activeName = document.getElementById("active-hazard-name");
            container.replaceChildren();

            if (activeHazard) {
                indicator.classList.remove("hidden");
                activeName.textContent = activeHazard;
                const activeCard = document.createElement("div");
                activeCard.className = "hazard-active rounded-xl border border-red-500 p-3 text-xs";
                activeCard.setAttribute("role", "alert");
                activeCard.setAttribute("aria-label", `${activeHazard} is the active climate hazard`);

                const activeTitle = document.createElement("div");
                activeTitle.className = "hazard-name flex items-center gap-2 font-extrabold";
                const dot = document.createElement("span");
                dot.className = "hazard-alert-dot";
                dot.setAttribute("aria-hidden", "true");
                activeTitle.append(dot, document.createTextNode(activeHazard));
                const status = document.createElement("div");
                status.className = "hazard-status mt-1 text-xs";
                status.textContent = "ACTIVE NOW";
                activeCard.append(activeTitle, status);
                container.appendChild(activeCard);
            } else {
                indicator.classList.add("hidden");
                activeName.textContent = "";
            }

            if (events && events.length) {
                events.forEach((event, index) => {
                    const card = document.createElement("div");
                    card.className = "rounded-xl border border-amber-900 bg-amber-950/40 p-3 text-xs";
                    const title = document.createElement("div");
                    title.className = "font-bold text-amber-300";
                    title.textContent = event;
                    const status = document.createElement("div");
                    status.className = "mt-1 text-emerald-300/80";
                    status.textContent = `Waiting in queue · FIFO position ${index + 1}`;
                    card.append(title, status);
                    container.appendChild(card);
                });
            }

            if (!activeHazard && (!events || events.length === 0)) {
                const empty = document.createElement("div");
                empty.className = "rounded-xl border border-emerald-900/70 bg-[#1b2219]/70 p-3 text-xs text-emerald-200/80";
                empty.textContent = "No active hazard or queued events.";
                container.appendChild(empty);
            } else if (activeHazard && (!events || events.length === 0)) {
                const empty = document.createElement("div");
                empty.className = "rounded-xl border border-emerald-900/70 bg-[#1b2219]/70 p-3 text-xs text-emerald-200/80";
                empty.textContent = "No more hazards waiting in the queue.";
                container.appendChild(empty);
            }
        }

        // These controls call Python's queue methods; JavaScript does not change queue order.
        async function processNextClimateHazard() {
            try {
                await initPyodide();
                const fn = pyodideInstance.globals.get("process_next_hazard");
                if (typeof fn !== "function") {
                    showToast("Run Topic 2 code first to initialize the climate queue.");
                    return;
                }
                fn();
                fn.destroy?.();
            } catch (err) {
                showToast(`Could not process hazard: ${err.message}`);
            }
        }

        async function resolveActiveClimateHazard() {
            try {
                await initPyodide();
                const fn = pyodideInstance.globals.get("resolve_active_hazard");
                if (typeof fn !== "function") {
                    showToast("Run Topic 2 code first to initialize the climate queue.");
                    return;
                }
                fn();
                fn.destroy?.();
            } catch (err) {
                showToast(`Could not resolve hazard: ${err.message}`);
            }
        }




        // Display bridge: Python owns the real harvested-crop records and sort operations.
        function updateHarvestInventory(records, sortLabel = "Harvest order") {
            const container = document.getElementById("harvest-inventory-list");
            if (!container) return;
            const rows = records && typeof records.toJs === "function" ? records.toJs() : records;
            const crops = Array.from(rows || []);
            container.innerHTML = "";
            document.getElementById("harvest-inventory-count").textContent = `${crops.length} crop${crops.length === 1 ? "" : "s"}`;
            document.getElementById("harvest-inventory-status").textContent = sortLabel;
            if (!crops.length) {
                const empty = document.createElement("p");
                empty.className = "text-xs text-emerald-300/70 py-3";
                empty.textContent = "No harvested crops yet. Grow a crop and click Harvest.";
                container.appendChild(empty);
                return;
            }
            crops.forEach(row => {
                const [id, name, weight, value] = Array.from(row);
                const item = document.createElement("div");
                item.className = "grid grid-cols-4 gap-2 rounded-lg bg-[#1b2219] border border-emerald-900/60 px-3 py-2 text-xs";
                [String(id), String(name), `${Number(weight).toFixed(2)} kg`, `${value} coins`].forEach((v, i) => {
                    const cell = document.createElement("span");
                    cell.className = i === 1 ? "text-emerald-100 font-semibold" : "text-emerald-300";
                    cell.textContent = v;
                    item.appendChild(cell);
                });
                container.appendChild(item);
            });
        }

        let sortAnimationTimer = null;
        let sortAnimationRunning = false;
        let lastSortRecords = [];
        const sortSleep = ms => new Promise(resolve => setTimeout(resolve, ms));

        function getSortSpeed() {
            return Number(document.getElementById("sort-speed")?.value || 550);
        }

        function drawSortBars(records, step = {}) {
            const chart = document.getElementById("sort-bars");
            if (!chart) return;
            chart.innerHTML = "";
            if (!records.length) {
                chart.innerHTML = '<p class="m-auto text-xs text-emerald-500/80">No harvested crops to visualize yet.</p>';
                return;
            }
            const metric = window.currentSortMetric || "weight";
            const maxValue = Math.max(1, ...records.map(c => Number(c[metric]) || 0));
            records.forEach((crop, index) => {
                const item = document.createElement("div");
                item.className = "sort-bar-item";
                const bar = document.createElement("div");
                const isCompared = (step.compare || []).includes(index);
                const isMinimum = step.minimum === index;
                const isSorted = metric === "weight" ? index >= (step.sorted_from ?? records.length) : index < (step.sorted_to ?? 0);
                bar.className = "sort-bar" + (isCompared ? " compare" : isMinimum ? " minimum" : isSorted ? " sorted" : "");
                bar.style.height = `${Math.max(12, (Number(crop[metric]) / maxValue) * 175)}px`;
                bar.textContent = metric === "weight" ? Number(crop.weight).toFixed(2) : String(crop.selling_value);
                bar.title = `${crop.name}: ${metric === "weight" ? crop.weight + " kg" : crop.selling_value + " coins"}`;
                const name = document.createElement("span");
                name.className = "sort-bar-name";
                name.textContent = crop.name;
                item.append(bar, name);
                chart.appendChild(item);
            });
        }

        function resetSortVisualization() {
            if (sortAnimationTimer) clearTimeout(sortAnimationTimer);
            sortAnimationRunning = false;
            if (lastSortRecords.length) drawSortBars(lastSortRecords);
            document.getElementById("sort-algorithm-label").textContent = "Ready";
            document.getElementById("sort-step-status").textContent = "Visualization reset. Choose a sorting algorithm.";
            setSortButtonsDisabled(false);
        }

        function setSortButtonsDisabled(disabled) {
            ["bubble-sort-button", "selection-sort-button", "sort-reset-button"].forEach(id => {
                const button = document.getElementById(id);
                if (button) button.disabled = disabled && id !== "sort-reset-button";
            });
        }

        async function playSortAnimation(steps, records, metric, title) {
            if (!steps.length || !records.length) {
                document.getElementById("sort-step-status").textContent = "No harvested crops yet. Harvest from the garden first.";
                drawSortBars([]);
                return;
            }
            if (sortAnimationTimer) clearTimeout(sortAnimationTimer);
            sortAnimationRunning = true;
            setSortButtonsDisabled(true);
            window.currentSortMetric = metric;
            document.getElementById("sort-algorithm-label").textContent = title;
            const byId = new Map(records.map(c => [Number(c.id), c]));
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                const ordered = step.ids.map(id => byId.get(Number(id))).filter(Boolean);
                drawSortBars(ordered, step);
                document.getElementById("sort-step-status").textContent = `Step ${i + 1} of ${steps.length}: ${step.note}`;
                await sortSleep(getSortSpeed());
            }
            lastSortRecords = records;
            // Re-read Python's final order so the inventory and bars show the same shared records.
            const finalRows = await pyodideInstance.runPythonAsync('[[c["id"], c["name"], c["weight"], c["selling_value"]] for c in garden.harvested_crops]');
            const finalCrops = finalRows.toJs().map(row => ({ id: row[0], name: row[1], weight: row[2], selling_value: row[3] }));
            updateHarvestInventory(finalCrops.map(c => [c.id, c.name, c.weight, c.selling_value]), `${title} complete`);
            drawSortBars(finalCrops, metric === "weight" ? { sorted_from: 0 } : { sorted_to: finalCrops.length });
            document.getElementById("sort-step-status").textContent = `Finished! ${finalCrops.length} crop(s) sorted. The shared garden inventory is now in this order.`;
            lastSortRecords = finalCrops;
            sortAnimationRunning = false;
            setSortButtonsDisabled(false);
        }

        async function runCropSort(fnName, metric, title) {
            if (sortAnimationRunning) return;
            try {
                await initPyodide();
                // Define Topic 6 functions on demand, while retaining the garden object from Topic 3.
                await pyodideInstance.runPythonAsync(topicTemplates[6].code);
                const before = await pyodideInstance.runPythonAsync('[[c["id"], c["name"], c["weight"], c["selling_value"]] for c in garden.harvested_crops] if "garden" in globals() and hasattr(garden, "harvested_crops") else []');
                const records = before.toJs().map(row => ({ id: row[0], name: row[1], weight: row[2], selling_value: row[3] }));
                if (!records.length) {
                    drawSortBars([]);
                    document.getElementById("sort-step-status").textContent = "Harvest at least one crop in Topic 3 before sorting.";
                    showToast("Harvest crops first, then run Topic 6 sorting.");
                    return;
                }
                const stepsJson = await pyodideInstance.runPythonAsync(`${fnName}()`);
                const steps = JSON.parse(stepsJson || "[]");
                await playSortAnimation(steps, records, metric, title);
            } catch (err) {
                console.error(err);
                showToast(`Sorting error: ${err.message}`);
                document.getElementById("sort-step-status").textContent = `Error: ${err.message}`;
                setSortButtonsDisabled(false);
                sortAnimationRunning = false;
            }
        }

        function sortCropsByWeight() {
            return runCropSort("sort_harvested_by_weight", "weight", "Bubble Sort · Weight");
        }
        function sortCropsBySellingValue() {
            return runCropSort("sort_harvested_by_selling_value", "selling_value", "Selection Sort · Value");
        }

        // addPlantToGrid(pos: int 0-24, name: str)
        // Marks a grid cell as planted (display only).
        function addPlantToGrid(pos, name) {
            gardenPlants[pos] = name;
            renderGarden();
        }




        function renderGarden() {
            const grid = document.getElementById("garden-grid");
            grid.innerHTML = "";
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement("div");
                cell.className = "aspect-square bg-[#2a3825] rounded-xl flex items-center justify-center text-3xl border border-emerald-800";
                cell.textContent = gardenPlants[i] ? "🌱" : "⬜";
                grid.appendChild(cell);
            }
        }




        // updateResources(water, seeds, energy, hope, coins)
        // Or pass a single object: updateResources({"water": n, "seeds": n, ...})
        // No fallbacks that turn a valid 0 into a default. Caps used only for bar width.
        function updateResources(water, seeds, energy, hope, coins) {
            if (typeof water === "object" && water !== null) {
                const args = water;
                water = args.water !== undefined ? args.water : 0;
                seeds = args.seeds !== undefined ? args.seeds : 0;
                energy = args.energy !== undefined ? args.energy : 0;
                hope = args.hope !== undefined ? args.hope : 0;
                coins = args.coins !== undefined ? args.coins : 0;
            } else {
                water = water !== undefined ? water : 0;
                seeds = seeds !== undefined ? seeds : 0;
                energy = energy !== undefined ? energy : 0;
                hope = hope !== undefined ? hope : 0;
                coins = coins !== undefined ? coins : 0;
            }
            const waterMax = 200, seedsMax = 100, energyMax = 120, hopeMax = 100;
            document.getElementById("water-text").innerText = `${water} / ${waterMax} L`;
            document.getElementById("water-bar").style.width = `${Math.min(100, (water / waterMax) * 100)}%`;
            document.getElementById("seeds-text").innerText = `${seeds} / ${seedsMax}`;
            document.getElementById("seeds-bar").style.width = `${Math.min(100, (seeds / seedsMax) * 100)}%`;
            const buySeedButton = document.getElementById("buy-seed-button");
            if (buySeedButton) buySeedButton.style.display = seeds <= 0 ? "block" : "none";
            document.getElementById("energy-text").innerText = `${energy} / ${energyMax} Wh`;
            document.getElementById("energy-bar").style.width = `${Math.min(100, (energy / energyMax) * 100)}%`;
            document.getElementById("hope-text").innerText = `${hope} / ${hopeMax}`;
            document.getElementById("hope-bar").style.width = `${Math.min(100, (hope / hopeMax) * 100)}%`;
            document.getElementById("coins-text").innerText = `${coins} Coins`;
        }




        // addPlantsToDropdown(plants: list of [name, emoji, cost])
        function addPlantsToDropdown(plants) {
            const select = document.getElementById("crop-selector");
            select.innerHTML = "";
            if (!plants) return;
            plants.forEach(([name, emoji, cost]) => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = `${emoji} ${name} (${cost}c)`;
                select.appendChild(option);
            });
        }




        // pushAction(action: str)
        // Appends a display label to the Action History panel (no JS undo logic).
        function pushAction(action) {
            displayActionHistory.push(action);
            if (displayActionHistory.length > 8) displayActionHistory.shift();
            renderActionStack();
        }




        function renderActionStack() {
            const container = document.getElementById("action-stack");
            container.innerHTML = "";
            [...displayActionHistory].reverse().forEach(act => {
                const div = document.createElement("div");
                div.className = "bg-emerald-950/60 border-l-2 border-amber-500 px-3 py-2 rounded text-xs text-emerald-100";
                div.textContent = `→ ${act}`;
                container.appendChild(div);
            });
        }




        // UI-only: removes the last displayed label. Your Python owns the real stack.
        function triggerUndo() {
            if (displayActionHistory.length > 0) {
                const undone = displayActionHistory.pop();
                renderActionStack();
                showToast(`Undid: ${undone}`);
            } else {
                showToast("Stack is empty.");
            }
        }




        function showToast(msg) {
            const toast = document.createElement("div");
            toast.className = "fixed bottom-6 right-6 bg-emerald-900 border border-emerald-400 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-sm";
            toast.textContent = msg;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        }




        async function runPythonCode() {
            const consoleEl = document.getElementById("output-console");
            consoleEl.innerHTML = `<span class="text-amber-400">Running...</span><br>`;
            try {
                await initPyodide();
                const code = document.getElementById("code-editor").value.trim();
                await pyodideInstance.runPythonAsync(code);
            } catch (err) {
                consoleEl.innerHTML += `<span class="text-red-400">Error: ${err.message}</span>`;
            }
        }




        function loadTopic() {
            const key = document.getElementById("topic-selector").value;
            document.getElementById("code-editor").value = topicTemplates[key].code;
        }




        function switchTab(tab) {
            document.getElementById("view-game").classList.toggle("hidden", tab !== "game");
            document.getElementById("view-code").classList.toggle("hidden", tab !== "code");
            document.getElementById("tab-game").classList.toggle("bg-[#283623]", tab === "game");
            document.getElementById("tab-game").classList.toggle("text-emerald-100", tab === "game");
            document.getElementById("tab-code").classList.toggle("bg-[#283623]", tab === "code");
            document.getElementById("tab-code").classList.toggle("text-emerald-100", tab === "code");
        }




        window.onload = () => {
            document.getElementById("version-badge").textContent = "v" + APP_VERSION;
            lucide.createIcons();
            renderGarden();
            renderActionStack();
            const speedSlider = document.getElementById("sort-speed");
            if (speedSlider) speedSlider.addEventListener("input", () => {
                document.getElementById("sort-speed-value").textContent = `${speedSlider.value} ms`;
            });
            // Resources stay at 0 until your Python calls updateResources(...)
            updateResources(0, 0, 0, 0, 0);




            const select = document.getElementById("topic-selector");
            Object.keys(topicTemplates).forEach(k => {
                const opt = document.createElement("option");
                opt.value = k;
                opt.textContent = topicTemplates[k].title;
                select.appendChild(opt);
            });
            loadTopic();
            switchTab("game");
            // Pre-load Pyodide in the background so the first Run is faster
            initPyodide().catch(() => {});
        };
