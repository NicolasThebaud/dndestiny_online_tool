'use strict';

(async () => {
    const res = await fetch("https://gist.githubusercontent.com/NicolasThebaud/0061ffc0f1a5ef28475fefcc66a67a9e/raw/", {cache: "reload"});
    const newBlob = new Blob([(await res.text())],{type: 'text/javascript'});
    const content = await import(URL.createObjectURL(newBlob));            

    const Dataset = content.Dataset;
    const Lootable = content.Lootable;

    const Game = class Game {
        lootReady = true;
        colors_enum = ["#8AFF91", "#00DAFF", "#E770FF", "#FFDF00", "#FF8900"];

        constructor() {
            const dataset = new Dataset();

            this.weapons = dataset.weapons;
            this.weapon_mods = dataset.weapon_mods;
            this.armor_mods = dataset.armor_mods;
            this.artifacts = dataset.artifacts;
        }

        displayLootables () {
            this.displayItems(this.weapons, "weapons");
            this.displayItems(this.weapon_mods, "mods_w");
            this.displayItems(this.armor_mods, "mods_a");
            this.displayItems(this.artifacts, "artifacts");
        }

        displayItems (pool, queryToken) {
            Object.entries(pool).forEach(([id, itemData]) => {
                let itemDiv = document.querySelector(`#${id}.cell`);
                if (itemDiv === null) { itemDiv = document.createElement("div"); }
                let itemSlot = itemDiv.querySelector(`#_${id}`);
                if (itemSlot === null) { itemSlot = document.createElement("div"); }
                let itemName = itemDiv.querySelector(".name");
                if (itemName === null) { itemName = document.createElement("p"); }
                let itemDetails = itemDiv.querySelector(".details");
                if (itemDetails === null) { itemDetails = document.createElement("div"); }

                itemDiv.id = id;
                itemDiv.classList.add("cell");
                itemSlot.classList.add("slot");
                itemSlot.id = `_${id}`;
                itemSlot.style.borderColor = this.colors_enum[itemData.rarity];
                itemName.classList.add("name");
                itemName.style.color = this.colors_enum[itemData.rarity];
                itemName.innerHTML = itemData.discovered ? `-  ${itemData.name}` : "";
                itemDetails.classList.add("details");
                itemDetails.innerHTML = itemData.discovered ? "details" : "";
                itemDiv.appendChild(itemSlot);
                itemDiv.appendChild(itemName);
                itemDiv.appendChild(itemDetails);
                /**/itemDiv.onclick = e => this.discoverLootable(e, pool);
                document.querySelector(`#${queryToken}`).appendChild(itemDiv);
            });
        }

        discoverLootable (e, pool) {
            const itemData = pool[e.currentTarget.id];

            if (!itemData) { return; }
            if (e.target.className === "details") {
                this.openItemDetails(pool[e.currentTarget.id], e.currentTarget.parentElement.id);
                return;
            }

            itemData.discovered = true;
            this.displayLootables();
        }

        postLootRecap(rarity) {
            const lootBt = document.querySelector("#loot");
            const closeBtn = document.querySelector("#close-loot");
            const panel = document.querySelector("#post-loot");
            const rarities = ["Commun", "Rare", "Epique", "Legendaire"];

            panel.style.left = "37.5vw";
            closeBtn.style.opacity = 1;

            panel.querySelector("h2").innerHTML = `Item ${rarities[rarity]} decouvert!`;
            panel.querySelector("#engram").src = `resources/engrams/e${rarity}.png`;

            const globalLootPool = [this.weapons, this.weapon_mods, this.armor_mods];
            const lootPool = globalLootPool[Math.floor(Math.random() * globalLootPool.length)];
            const filteredRarities = Object.entries(lootPool).filter(([id, item]) => +item.rarity === rarity);
            const lootedItem = filteredRarities[Math.floor(Math.random() * filteredRarities.length)];

            panel.querySelector("h3").style.color = this.colors_enum[+lootedItem[1].rarity];
            panel.querySelector("h3").innerHTML = lootedItem[1].name;
            panel.querySelector("h4").innerHTML = lootedItem[1].type || "";
            
            document.querySelector(`#${lootedItem[0]}`).click();

            closeBtn.onclick = () => {
                document.querySelector("#post-loot").style.left = "2000px";
                document.querySelector("#close-loot").style.opacity = 0;
                document.querySelector("#loot").style.opacity = 1;
            
                this.lootReady = true;
            }
        }

        playLootVideo(rarity) {
            const player = document.querySelector("#player");
            const video = document.querySelector("#video");
            const track = document.querySelector("#mp4");
            const button = document.querySelector("#loot");
        
            video.onloadeddata = () => {
                player.style.left = "17.5vw";
                video.style.opacity = 1;
                button.style.opacity = 0;
                video.play();
            }
            video.onended = () => {
                player.style.left = "2000px";
                video.style.opacity = 0;
                this.postLootRecap(rarity);
            }

            switch(rarity) {
                case 0:
                    track.src = "resources/videos/opening_common.mp4";
                    break;
                case 1:
                    track.src = "resources/videos/opening_rare.mp4";
                    break;
                case 2:
                    track.src = "resources/videos/opening_epic.mp4";
                    break;
                case 3:
                    track.src = "resources/videos/opening_legendary.mp4";
                    break;
            }
            video.load();
        }

        lootRandom() {
            if (!this.lootReady) { return; }

            let roll = Math.floor(Math.random() * 20) + 1;
            
            this.lootReady = false;
            if (roll < 5) { 
                this.lootReady = true;
                return; // no loot
            } else if (roll < 10) { // common
                this.playLootVideo(0);
            } else if (roll < 14) { // rare
                this.playLootVideo(1);
            } else if (roll < 16) { // epic
                this.playLootVideo(2);
            } else { // legendary
                this.playLootVideo(3);
            }
        }

        openItemDetails (lootable, pool) {
            const closeBtn = document.querySelector("#close-loot");

            document.querySelector("#loot").style.opacity = 0;
            closeBtn.style.opacity = 1;
            closeBtn.onclick = () => {
                document.querySelector("#details-weapons").style.left = "2000px";
                document.querySelector("#details-mods_w").style.left = "2000px";
                document.querySelector("#details-mods_a").style.left = "2000px";
                document.querySelector("#details-artifacts").style.left = "2000px";
                document.querySelector("#close-loot").style.opacity = 0;
                document.querySelector("#loot").style.opacity = 1;
            }

            switch (pool) {
                case "weapons": 
                    this.openWeaponDetails(lootable);
                    break;
                case "mods_w": 
                    this.openWeaponModsDetails(lootable);
                    break;
                case "mods_a": 
                    this.openAmorModsDetails(lootable);
                    break;
            }
        }

        openWeaponDetails (weapon) {
            const panel = document.querySelector("#details-weapons");
            const name = panel.querySelector(".details-name");

            name.style.color = this.colors_enum[+weapon.rarity];
            name.innerHTML = weapon.name;
            panel.querySelector(".details-type").innerHTML = weapon.type;
            panel.querySelector(".details-dmg").innerHTML = `<span style="color: #CCA408"><b>Dégâts</b></span></br>${weapon.dmg}`;
            panel.querySelector(".details-ammo").innerHTML = `<span style="color: #CCA408"><b>Chargeur</b></span></br>${weapon.ammo}`;
            panel.querySelector(".details-range").innerHTML = `<span style="color: #CCA408"><b>Range</b></span></br>${weapon.range}`;
            panel.querySelector(".details-properties").innerHTML = `<span style="color: #CCA408"><b>Propriétés</b></span></br>${weapon.props}`;
            
            panel.querySelector(".details-traits").innerHTML = weapon.longDesc;

            panel.style.left = "37.5vw";
        }
        openWeaponModsDetails (mod) {
            const panel = document.querySelector("#details-mods_w");
            const name = panel.querySelector(".details-name");

            name.style.color = this.colors_enum[+mod.rarity];
            name.innerHTML = mod.name;
            panel.querySelector(".details-type").innerHTML = mod.type;
            panel.querySelector(".details-condition").innerHTML = `<span style="color: #CCA408"><b>Applicable sur</b></span></br>${mod.props}`;
            
            panel.querySelector(".details-traits").innerHTML = mod.longDesc;

            panel.style.left = "37.5vw";
        }
        openAmorModsDetails (mod) {
            const panel = document.querySelector("#details-weapons");
            const name = panel.querySelector(".details-name");

            name.style.color = this.colors_enum[+mod.rarity];
            name.innerHTML = mod.name;
            panel.querySelector(".details-type").innerHTML = mod.type;
            panel.querySelector(".details-traits").innerHTML = mod.longDesc;

            panel.style.left = "37.5vw";
        }
    }

    //////////////////////////////
    //// RUNTIME
    //////////////////////////////
    const game = new Game();

    game.displayLootables();
    document.querySelector("#loot").onclick = () => game.lootRandom();
})();
