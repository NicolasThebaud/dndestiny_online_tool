'use strict';

const rarity_enum = {
    COMMON: "0",
    RARE: "1",
    EPIC: "2",
    LEGENDARY: "3",
    EXOTIC: "4" // outside of loot pools
}
const weapon_type_enum = {
    PISTOL: "PISTOLET",
    REVOLVER: "REVOLVER",
    SHOTGUN: "SHOTGUN",
    SMG: "PISOLET MITRAILLEUR",
    SNIPER: "FUSIL DE SNIPER",
    SWORD: "EPEE",
    AUTO: "FUSIL AUTO.",
    SCOUT: "FUSIL D'ECLAIREUR",
    BOW: "ARC DE COMBAT"
}
const weaponmods_type_enum = {
    ONE: "1 SLOT",
    TWO: "2 SLOTS",
    THREE: "3 SLOTS"
}
const armormods_type_enum = {
    HELMET: "CASQUE",
    CHEST: "TORSE",
    HANDS: "GANTELETS",
    LEGS: "JAMBIERES"
}
const colors_enum = ["#8AFF91", "#00DAFF", "#E770FF", "#FFDF00", "#FF8900"];

const Game = class Game {
    lootReady = true

    weapons = {
        w1: new Lootable("Rat King - Revolver", rarity_enum.COMMON, weapon_type_enum.REVOLVER, "1d8 cinétiques", "7/10/30", "6", "Finesse", "<b style='color: #CCA408'>*Vermine*</b> Lorsque vous tuez un énémi avec cette arme, vous êtes Camouflé jusqu'a votre prochain tour.</br><b style='color: #CCA408'>*Roi des Rats*</b> Ajoutez un dé de dégâts supplémentaire a vos DMG pour chaque allié possédent une arme Rat King."),
        w2: new Lootable("Rat King - Shotgun", rarity_enum.COMMON, weapon_type_enum.SHOTGUN, "1d12", "5/7/15", "8", "Gros Recul", "<b style='color: #CCA408'>*Vermine*</b> Lorsque vous tuez un énémi avec cette arme, vous êtes Camouflé jusqu'a votre prochain tour.</br><b style='color: #CCA408'>*Roi des Rats*</b> Ajoutez un dé de dégâts supplémentaire a vos DMG pour chaque allié possédent une arme Rat King."),
        w3: new Lootable("Rat King - Fusil Auto", rarity_enum.RARE, weapon_type_enum.AUTO, "1d10", "7/20/40", "10", "Tir Auto.", "<b style='color: #CCA408'>*Vermine*</b> Lorsque vous tuez un énémi avec cette arme, vous êtes Camouflé jusqu'a votre prochain tour.</br><b style='color: #CCA408'>*Roi des Rats*</b> Ajoutez un dé de dégâts supplémentaire a vos DMG pour chaque allié possédent une arme Rat King."),
        w4: new Lootable("Souvenir de Taas", rarity_enum.RARE, weapon_type_enum.AUTO, "2d8", "7/20/40", "10", "Tir Auto.", "<b style='color: #CCA408'>*Corruption</b> Lorsque vous tuez une créature avec cette arme, génère une orbe de Corruption au sol; Une fois récupérée, vous pouvez la lancer comme une grenade; Si vous décidez de reprendre votre arme ou de lâcher l'orbe, elle disparaît</br><i>note: inflige 3d8 dégâts explosifs corrompus; Sauvegarde DEX [dmg /2]; +1d8 par Light Level > 1; 20m max</i>"),
        w5: new Lootable("Rat King - Sniper", rarity_enum.EPIC, weapon_type_enum.SNIPER, "1d10", "-/100/200", "5", "-", "<b style='color: #CCA408'>*Vermine*</b> Lorsque vous tuez un énémi avec cette arme, vous êtes Camouflé jusqu'a votre prochain tour.</br><b style='color: #CCA408'>*Roi des Rats*</b> Ajoutez un dé de dégâts supplémentaire a vos DMG pour chaque allié possédent une arme Rat King."),
        w6: new Lootable("Centurion Noir", rarity_enum.EPIC, weapon_type_enum.SCOUT, "2d10", "5/40/100", "4", "Rechargement, Gros Recul", "Inspiré de la Technologie des Cabals, cette arme inventée par Banshee-44 requiert de l'Huile Cabale pour fonctionner; Une unité d'Huile permet d'utiliser deux chargeurs (2*4) de munitions cabales"),
        w7: new Lootable("Crochet Buveur", rarity_enum.LEGENDARY, weapon_type_enum.SWORD, "2d12", "-", "-", "-", "<b style='color: #CCA408'>*Appétit ancien*</b> une fois par tour, si vous tuez une créature avec cette arme, vous rechargez 2d6 points de bouclier</br><b style='color: #CCA408'>*Corrompu*</b> +2 bonus aux jets d'attaque et de dégâts; Vous pouvez dépenser une munition pour infliger des dégâts Corrompus (mun. 40)"),
        w8: new Lootable("Souhait de la Forêt", rarity_enum.LEGENDARY, weapon_type_enum.BOW, "2d10", "7/30/60", "-", "Rechargement, Quickscope", "<b style='color: #CCA408'>*Lanterne Fraternelle*</b> Si vous utilisez votre compétence de classe avec cette arme en main, vous pouvez lancer gratuitement  un jet de recharge pour cette compétence - avec avantage - à la fin de votre tour"),
        w9: new Lootable("Touché Pernicieux", rarity_enum.LEGENDARY, weapon_type_enum.SCOUT, "3d10", "5/40/80", "10", "Tir Auto.", "<b style='color: #CCA408'>*Touché Pernicieux*</b> Vos jets d'attaques ont +3; Lorsque vous touchez une cible, vous subissez 2d10 de dégâts de Corruption (directement sur vos PVs); vous ajoutez également ce nombre a votre jet de dégâts</br><b style='color: #CCA408'>*Touché Miséricordieux*</b> Lorsque vous éliminez une créature avec cette arme, Vous regagnez 3d8 PV (ignore le bouclier)")
    }
    weapon_mods = {
        wm1: new Lootable("Point Sensible", rarity_enum.COMMON, weaponmods_type_enum.TWO, "", "", "", "** (sauf Puissant)", "Lorsque vous infligez à une créature la moitié (ou plus) de ses PV restants en un coup (une seule fois par créature) celle-ci devient affaiblie pendant 2 tours"),
        wm2: new Lootable("Aligement", rarity_enum.COMMON, weaponmods_type_enum.TWO, "", "", "", "** (sauf Puissant)", "Lorsque vous touchez un énemi ayant un bouclier du même élément que votre arme, augmentez de un la taille du dé de dmg</br><i>note: ce mod est uniquement utilisable sur une arme élémentaire ou qui possède un module élémentaire</i>"),
        wm3: new Lootable("IEM", rarity_enum.COMMON, weaponmods_type_enum.TWO, "", "", "", "Lance-Grandes", "Lorsque vous utilisez cette arme, vous pouvez chisoir de tirer des grenades non explosives, qui crééent à la place une explosion électro-magnétique capable de désactiver certaines construction ou certains méchanismes</br><i>note: les grenades IEM s'achetent pour 300Lumen les deux chez Banshee-44</i>"),
        wm4: new Lootable("Point Final", rarity_enum.RARE, weaponmods_type_enum.TWO, "", "", "", "** (sauf Puissant)", "Vous effectuez une attaque critique sur un 19 avec cette arme</br>Vos dégâts sont multipliés par 3 en cas de coup critique (au lieu de 2)"),
        wm5: new Lootable("Foudroyeur", rarity_enum.EPIC, weaponmods_type_enum.TWO, "", "", "", "** (sauf Puissant)", "Si vous possédez la capacité Multi-Attaque, vous pouvez faire 3 attaques avec cette arme pendant votre tour"),
        wm6: new Lootable("Superchargeur", rarity_enum.LEGENDARY, weaponmods_type_enum.THREE, "", "", "", "** (sauf Puissant)", "Si vous utilisez votre Super en ayant cette arme équipée, elle devient Chargée; à ce titre, vous lancez 3 fois vos dés de dégâts pour chaque cible touchée pendant les 5 tours suivants le lancement de votre super")
    }
    armor_mods = {
        am1: new Lootable("Casque Stabilisateur", rarity_enum.COMMON, armormods_type_enum.HELMET, "", "", "", "", "Lorsque vous tirez avec une arme dotée du trait 'Tir Automatique', vous lancez 3 dés (au lieu de 2) et ignorer les deux plus petits"),
        am2: new Lootable("AC/0", rarity_enum.RARE, armormods_type_enum.HANDS, "", "", "", "", "Si vous recharger votre arme équipée alors qu'il reste une ou plusieurs balles dans le chargeur, délivre une charge Electrique autout de vous (3m)</br>Plus le chargeur est vide, plus la décharge sera importante</br><i>note: les munitions restantes sont perdues</i>"),
        am3: new Lootable("Surchargeur Quantique", rarity_enum.RARE, armormods_type_enum.CHEST, "", "", "", "", "Lorsque vous subissez des dégâts qui vous ferait perdre votre bouclier*, Rechargez votre bouclier de 2d8+2</br><i>(*) vous ignorez également les PV que vous devriez perdre</i>"),
        am4: new Lootable("Holster", rarity_enum.RARE, armormods_type_enum.LEGS, "", "", "", "", "Si vous possédez un Revolver ou un Pistolet, vous pouvez le ranger dans un Holster; En tant qu'Action Bonus, vous pouvez effectuer un Tir au jugé avec cette arme; Elle obéit au même règles (ATQ DC, Range, etc.) que si utilisée normalement</br><i>note: vous ne pouvez pas faire tomber une arme rangée dans un holster</i>"),
        am5: new Lootable("Gants du Lancier", rarity_enum.EPIC, armormods_type_enum.HANDS, "", "", "", "", "Vous pouvez utiliser votre charge de compétence de classe pour invoquer une Sombrelance; Cette arme se lance sans test (choix au sol) à une distance max de 30m; à l'impact, elle créé une onde de choc d'un diamètre de 5m qui Corrompt les énémis pendant 3 tours</br><i>DMG: 3d8 explosifs corrompus (1d8 si l'énemi réussi sa sauv. DEX)</i>"),
        am6: new Lootable("Bottes de Transmutation", rarity_enum.EPIC, armormods_type_enum.LEGS, "", "", "", "", "Vous pouvez utiliser votre charge de compétence de classe pour manifester une zone de Transmutation au sol")
    }
    artifacts = {
        a1: new Lootable("Cristal d'Osmium", rarity_enum.EXOTIC),
        a2: new Lootable("Specimen 12", rarity_enum.EXOTIC),
        a3: new Lootable("Crâne du traître", rarity_enum.EXOTIC)
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
            itemSlot.style.borderColor = colors_enum[itemData.rarity];
            itemName.classList.add("name");
            itemName.style.color = colors_enum[itemData.rarity];
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

        panel.querySelector("h3").style.color = colors_enum[+lootedItem[1].rarity];
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

        name.style.color = colors_enum[+weapon.rarity];
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

        name.style.color = colors_enum[+mod.rarity];
        name.innerHTML = mod.name;
        panel.querySelector(".details-type").innerHTML = mod.type;
        panel.querySelector(".details-condition").innerHTML = `<span style="color: #CCA408"><b>Applicable sur</b></span></br>${mod.props}`;
        
        panel.querySelector(".details-traits").innerHTML = mod.longDesc;

        panel.style.left = "37.5vw";
    }
    openAmorModsDetails (mod) {
        const panel = document.querySelector("#details-weapons");
        const name = panel.querySelector(".details-name");

        name.style.color = colors_enum[+mod.rarity];
        name.innerHTML = mod.name;
        panel.querySelector(".details-type").innerHTML = mod.type;
        panel.querySelector(".details-traits").innerHTML = mod.longDesc;

        panel.style.left = "37.5vw";
    }
}

//////////////////////////////
//// CLASSES 
//////////////////////////////

const Lootable = class Lootable {
    constructor (name, rarity, type, dmg, range, ammo, props, longDesc) {
        this.name = name;
        this.rarity = rarity;
        this.type = type;
        this.dmg = dmg;
        this.range = range;
        this.ammo = ammo;
        this.props = props;
        this.longDesc = longDesc;

        this.discovered = false;
    }
}

//////////////////////////////
//// RUNTIME
//////////////////////////////
const game = new Game();

game.displayLootables();
document.querySelector("#loot").onclick = () => game.lootRandom();