/**
 * Title scene
 * @author Rex Zeng
 */

import G from '../Global';
import {
    setPosition,
} from '../Functions';
import SceneBase from './SceneBase';
import SceneMusicSelect from './SceneMusicSelect';

const {
    MAIN_FONT,
    MAIN_FONT_SIZE,
} = G.constant;

/**
 * Define title scene
 * @class
 */
export default class SceneTitle extends SceneBase {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.name = 'title';
        this.titleTextTimer = 0;
        this.str = 'Parallel Rails';
        this.pos = -1;
        this.chrBak = '';
    }
    /**
     * Trigger when scene is initialized
     * @param {function} next - Provided by then.js
     * @override
     */
    onInitialize(next) {
        // title message
        this.titleMessageSprite = new PIXI.Text(this.str, {
            fontFamily: MAIN_FONT,
            fontSize: 48,
            fill: '#FFF',
        });
        setPosition(this.titleMessageSprite,  () => ({
            x: 0.5 * (window.innerWidth - this.titleMessageSprite.width),
            y: 0.5 * (window.innerHeight - this.titleMessageSprite.height) - 32,
        }));
        this.stage.addChild(this.titleMessageSprite);
        // start message
        this.startMessageSprite = new PIXI.Text('Made by Rex Zeng using Pixi.js', {
            fontFamily: MAIN_FONT,
            fontSize: MAIN_FONT_SIZE,
            fill: '#FFF',
        });
        setPosition(this.startMessageSprite, () => ({
            x: 0.5 * (window.innerWidth - this.startMessageSprite.width),
            y: 0.5 * (window.innerHeight - this.startMessageSprite.height) + 15,
        }));
        this.stage.addChild(this.startMessageSprite);
        // press button message
        this.pressMessageSprite = new PIXI.Text('[P] play beatmap\n\n[E] edit beatmap', {
            fontFamily: MAIN_FONT,
            fontSize: MAIN_FONT_SIZE,
            fill: '#FFF',
        });
        setPosition(this.pressMessageSprite, () => ({
            x: 0.5 * (window.innerWidth - this.pressMessageSprite.width),
            y: 0.5 * (window.innerHeight - this.pressMessageSprite.height) + 80,
        }));
        this.stage.addChild(this.pressMessageSprite);
        next();
    }
    /**
     * Do calculations only, DO NOT do any paint in this function
     * @override
     */
    update() {
        super.update();
        this.updateTitleTextContent();
        if (G.input.isPressed(G.input.P)) {
            // press P to enter music select
            G.mode = 'play';
            G.scene = new SceneMusicSelect;
        } else if (G.input.isPressed(G.input.E)) {
            G.mode = 'edit';
            G.scene = new SceneMusicSelect;
        }
    }
    /**
     * Make title text more fancy by changing a character randomly
     */
    updateTitleTextContent() {
        this.titleTextTimer++;
        if (this.titleTextTimer < 20) {
            let rnd = 0, t = 0;
            do {
                rnd = Math.random();
                t = String(rnd * this.str.length);
                if (/\-/.test(t)) {
                    t = 0;
                } else {
                    t = parseInt(t);
                }
            } while (t == this.pos || this.str[t] == ' ');
            if (this.chrBak.length == 0) {
                this.pos = t;
                this.chrBak = this.str[this.pos];
            }
            this.str = this.str.slice(0, this.pos) + String.fromCharCode(rnd * 26 + (rnd > 0.5 ? 65 : 97)) + this.str.slice(this.pos + 1);
            this.titleMessageSprite.text = this.str;
        } else if (this.titleTextTimer == 20) {
            this.str = this.str.slice(0, this.pos) + this.chrBak + this.str.slice(this.pos + 1);
            this.titleMessageSprite.text = this.str;
            this.chrBak = '';
        } else if (this.titleTextTimer >= 120) {
            this.titleTextTimer = 0;
        }
    }
}
