(function() { 
    "use strict";

    const SPRITE_SIZE = 16; // Each sprite sheet tile is 16x16 pixels.
    const SCALE = 2; // Scale the character 2x larger.
    const CANVAS_WIDTH = 400; // Width of the canvas area.
    const CANVAS_HEIGHT = 100; // Height of the canvas area.
    const PATH_HEIGHT = 24; // Height of the dirt path

    let buffer, display, sprite_sheet, animation, cobblestone_texture;
    let groundX = 0; // Initial position of the ground (starting from 0)

    // Animation class for managing frames
    var Animation = function(frame_set, delay) {
        this.count = 0; 
        this.delay = delay;
        this.frame = 0; 
        this.frame_index = 0; 
        this.frame_set = frame_set; 
    };

    Animation.prototype = {
        update: function() {
            this.count++;
            if (this.count >= this.delay) {
                this.count = 0;
                this.frame_index = (this.frame_index === this.frame_set.length - 1) ? 0 : this.frame_index + 1;
                this.frame = this.frame_set[this.frame_index];
            }
        }
    };

    // Initialize the canvas
    buffer = document.createElement("canvas").getContext("2d");
    display = document.querySelector(".character").getContext("2d");

    buffer.canvas.width = CANVAS_WIDTH;
    buffer.canvas.height = CANVAS_HEIGHT;

    display.imageSmoothingEnabled = false;
    buffer.imageSmoothingEnabled = false;

    // Create sprite sheet and animation
    sprite_sheet = {
        image: new Image(),
        frame_sets: [[2, 3]] // Walking right animation
    };

    animation = new Animation(sprite_sheet.frame_sets[0], 15);

    // Load the cobblestone texture (cobblestone.png)
    cobblestone_texture = {
        image: new Image()
    };

    // Main animation loop
    const loop = function() {
        animation.update();

        // Clear canvas
        buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height);

        // Move the ground texture (scrolling effect)
        const scrollSpeed = 1; // Speed of ground scrolling to the left
        groundX -= scrollSpeed;

        // If the ground has moved off the left side of the canvas, reset it to the right
        if (groundX <= -SPRITE_SIZE) {
            groundX = 0;
        }

        // Draw the cobblestone texture repeatedly across the ground
        const tileWidth = 16; // Width of each tile in the cobblestone texture
        const tileHeight = 16; // Height of each tile in the cobblestone texture
        const pathWidth = CANVAS_WIDTH;

        // Tile the cobblestone texture across the canvas, based on the groundX position
        for (let x = groundX; x < pathWidth; x += tileWidth) {
            for (let y = CANVAS_HEIGHT - PATH_HEIGHT; y < CANVAS_HEIGHT; y += tileHeight) {
                // Draw the cobblestone texture scaled to the tile size (16x16)
                buffer.drawImage(
                    cobblestone_texture.image,
                    0, 0, 297, 297, // Source: Entire image (we'll scale it down)
                    x, y, tileWidth, tileHeight  // Destination: Position and size for tiling
                );
            }
        }

        // Draw the character sprite on top of the cobblestone ground
        const yOffset = 20; // Adjust this to move the character further down
        const scaledSize = SPRITE_SIZE * SCALE;
        const xPosition = (CANVAS_WIDTH - scaledSize) / 2; // Center horizontally
        const yPosition = ((CANVAS_HEIGHT - scaledSize) / 2) + yOffset; // Move down
        
        buffer.drawImage(
            sprite_sheet.image,
            animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, // Source sprite for character
            xPosition, yPosition, scaledSize, scaledSize // Destination position and size
        );

        // Render to the display
        display.clearRect(0, 0, display.canvas.width, display.canvas.height);
        display.drawImage(buffer.canvas, 0, 0, display.canvas.width, display.canvas.height);

        requestAnimationFrame(loop);
    };

    // Load sprite sheets and start animation
    sprite_sheet.image.addEventListener("load", function() {
        cobblestone_texture.image.addEventListener("load", function() {
            requestAnimationFrame(loop);
        });
        cobblestone_texture.image.src = "images/sand.png"; // Path to your cobblestone texture
    });

    sprite_sheet.image.src = "images/animation.png"; // Path to your character sprite sheet
})()