import {FieldDef} from "../FieldDef";
import {Num} from "../../Num";

/**
 * Fetch data
 *
 *
 //http://cssvalues.com/
 var cssValues = {};
 [].slice.call(
 document.getElementsByTagName('section')).forEach(
 (elem) => {
        var id = elem.id;
        var values = [];
        cssValues[id] = values;
        [].slice.call(elem.getElementsByTagName('code')).forEach((codeElem) => {
            console.log(codeElem);
            values.push(codeElem.innerText);
        })
    }
 )
 console.log(JSON.stringify(cssValues));
 *
 */
export class CSSField extends FieldDef {

    tags:Array<string>;

    constructor(id:string, name:string) {
        super(name);
        this.tags = CSSField.getTagsList(id);
    }

    getInitialValue():any {
        var val:Array = [],
            half = this.tags.length / 2;

        for (let i = 0; i < half + Num.randomInt(0, half); i++) {
            val.push(CSSField.buildSingleCSS(this.tags, 5, 30));
        }

        return val;
    }

    static getFullCSSString(obj:Array):string {
        var value = "";

        obj.forEach(def => {
            value += def.sel + "{";
            def.def.forEach(props => {
                value += props.property + ":" + props.value + ";";
            });
            value += "}"
        });

        return value;
    }


    static buildSingleCSS(selectors:Array<string>, minRules:number = 1, maxRules:number = 10):string {
        var css:any = {};
        var selector:string = Num.randomArrPicker(selectors);
        css.sel = selector;
        css.def = [];

        for (let i:number = 0; i < Math.round(Math.random() * (maxRules - minRules)) + 1; i++) {
            css.def.push(CSSField.getSingleCSSRule());
        }

        return css;
    }

    static getSingleCSSRule():any {
        var keys = Object.keys(CSSField.CSSOptions);
        var cssRule:any = {};
        var selectedKey = Num.randomArrPicker(keys);
        var tempValue:string = Num.randomArrPicker(CSSField.CSSOptions[selectedKey]);
        cssRule.property = selectedKey;
        cssRule.value = CSSField.parseValue(tempValue);
        return cssRule;
    }

    static getCSSValueForProp(prop:string):string {
        return CSSField.parseValue(CSSField.CSSOptions[prop]);
    }


    static parseValue(value:String):string {
        var final = "",
            isTag = false,
            lastIndex = 0;

        for (let i = 0; i < value.length; i++) {
            if (value[i] === "<" || value[i] === "[") {
                lastIndex = i + 1;
                isTag = true;
            } else if (value[i] === ">") {
                isTag = false;
                var tagName = value.substr(lastIndex, i - lastIndex);
                switch (tagName) {
                    case "number":
                        final += Num.randomInt(0, 100);
                        break;
                    case "percentage":
                        final += Num.randomInt(0, 100) + "%";
                        break;
                    case "length":
                    case "integer":
                        final += Num.randomInt(-1028, 1028) + "px";
                        break;
                    case "time":
                        final += Num.roundToPrecision(Num.getRandomNum(0, 2), 2) + "s";
                        break;
                    case "currentColor":
                    case 'color':
                        final += "rgba("
                            + Num.randomInt(0, 255) + ","
                            + Num.randomInt(0, 255) + ","
                            + Num.randomInt(0, 255) + ","
                            + Num.roundToPrecision(Num.getRandomNum(0, 1), 2) + ")";
                        break;
                    default:
                        console.log(tagName);

                }
            } else if (value[i] === "]") {
                isTag = false;
                var tagName = value.substr(lastIndex, i - lastIndex);
                //console.log(tagName);
                var parse = Num.randomArrPicker(CSSField.CSSOptions[tagName]);
                //console.log(parse);
                final += CSSField.parseValue(parse);
            } else if (!isTag) {
                final += value[i];
            }


        }

        return final;
    }


    static getTagsList(id):Array<string> {
        var tags:Set<string> = new Set([]);
        this.iterateElement(document.getElementById(id), "#" + id, tags);
        return Array.from(tags);
    }

    static iterateElement(element:HTMLElement, ancestry:string, tags:Set<string>) {
        [].slice.call(element.children).forEach((elem:HTMLElement) => {
            var tagName = elem.tagName.toLowerCase();
            tags.add(ancestry + " " + tagName);

            if (elem.classList.length > 0) {
                [].slice.call(elem.classList).forEach(name => {
                    tags.add(ancestry + " " + tagName + "." + name);
                    tags.add(ancestry + " ." + name);
                })
            }

            this.iterateElement(elem, ancestry, tags);
        })
    }


    static CSSOptions:any = {
        "all": ["initial", "unset", "inherit"],
        "animation": ["[animation-name] [animation-duration] [animation-timing-function] [animation-delay] [animation-iteration-count] [animation-direction] [animation-fill-mode] [animation-play-state]"],
        "animation-delay": ["0s", "<time>", "@keyframes"],
        "direction": ["ltr", "rtl"],
        "animation-direction": ["normal", "reverse", "alternate-reverse", "alternate", "@keyframes"],
        "animation-duration": ["0s", "<time>", "@keyframes"],
        "animation-fill-mode": ["none", "forwards", "both", "backwards"],
        "animation-iteration-count": ["1", "infinite", "<number>", "@keyframes"],
        "animation-name": ["none", "@keyframes", "@keyframes"],
        "animation-timing-function": ["ease", "steps(<integer>, start)", "steps(<integer>, end)", "step-start", "step-end", "linear", "ease-out", "ease-in-out", "ease-in", "cubic-bezier(<number>, <number>, <number>, <number>)", "@keyframes"],
        "animation-play-state": ["running", "paused", "@keyframes"],
        "visibility": ["visible", "hidden", "collapse"],
        "backface-visibility": ["visible", "hidden"],
        "background": ["[background-color] [background-repeat] [background-attachment] [background-position] / [background-size] [background-origin] [background-clip]", "background-size", "background-position", "background-origin", "background-clip", "background-origin", "background-origin", "background-clip"],
        "background-attachment": ["scroll", "local", "fixed", "background-attachment"],
        "background-blend-mode": ["normal", "soft-light", "screen", "saturation", "overlay", "multiply", "luminosity", "lighten", "hue", "hard-light", "exclusion", "difference", "darken", "color-dodge", "color-burn", "color"],
        "color": ["<color>"],
        "background-color": ["transparent", "<color>"],
        "clip": ["auto", "rect(<length>, <length>, <length>, <length>)", "inset(<length>, <length>, <length>, <length>)", "clip-path"],
        //"clip-path": ["none", "view-box", "stroke-box", "fill-box", "<url>", "<shape-box>", "<basic-shape>", "clip"],
        "background-clip": ["border-box", "padding-box", "content-box", "background-clip"],
        //"background-image": ["none", "url(\"path/file.png\")", "<repeating-gradient>", "<radial-gradient>", "<linear-gradient>", "<image-function>"],
        "background-origin": ["padding-box", "content-box", "border-box", "background-attachment"],
        "position": ["static", "sticky", "relative", "page", "fixed", "center", "absolute"],
        "background-position": ["0% 0%", "right bottom", "left top", "center center", "<percentage> <length>", "background-position"],
        "background-repeat": ["repeat", "space", "round", "repeat-y", "repeat-x", "repeat no-repeat", "no-repeat", "background-repeat"],
        "background-size": ["auto", "cover", "contain", "auto <percentage>", "<percentage> <length>", "<percentage>", "<length> auto", "<length> <percentage>", "<length>"],
        "order": ["0", "<integer>"],
        "border": ["[border-width] [border-style] [border-color]", "border-image"],
        "border-collapse": ["separate", "collapse"],
        "border-color": ["<currentColor>", "transparent", "<color>"],
        "top": ["auto", "<percentage>", "<length>"],
        "border-top": ["[border-width] [border-style] [border-color]"],
        "border-top-color": ["<currentColor>", "transparent", "<color>"],
        "right": ["auto", "<percentage>", "<length>"],
        "border-right": ["[border-width] [border-style] [border-color]"],
        "border-right-color": ["<currentColor>", "transparent", "<color>"],
        "bottom": ["auto", "<percentage>", "<length>"],
        "border-bottom": ["[border-width] [border-style] [border-color]"],
        "border-bottom-color": ["<currentColor>", "transparent", "<color>"],
        "left": ["auto", "<percentage>", "<length>"],
        "border-left": ["[border-width] [border-style] [border-color]"],
        "border-left-color": ["<currentColor>", "transparent", "<color>"],
        "border-radius": ["0", "<percentage>", "<length> <length> <length> <length>", "<length> / <percentage>", "<length>"],
        "border-top-left-radius": ["0", "<percentage>", "<length>"],
        "border-top-right-radius": ["0", "<percentage>", "<length>"],
        "border-bottom-left-radius": ["0", "<percentage>", "<length>"],
        "border-bottom-right-radius": ["0", "<percentage>", "<length>"],
        //"border-image": ["[border-image-source] [border-image-slice] / [border-image-width] [border-image-width] / [border-image-outset] [border-image-repeat]"],
        //"border-image-source": ["none", "url(\"path/file.png\")"],
        "width": ["auto", "<percentage>", "<length>"],
        "border-image-repeat": ["stretch", "space", "round", "repeat"],
        "border-spacing": ["0", "<length> <length>", "<length>"],
        "border-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "border-top-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "border-right-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "border-bottom-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "border-left-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "border-width": ["medium", "thin", "thick", "<length>"],
        "border-top-width": ["medium", "thin", "thick", "<length>"],
        "border-right-width": ["medium", "thin", "thick", "<length>"],
        "border-bottom-width": ["medium", "thin", "thick", "<length>"],
        "border-left-width": ["medium", "thin", "thick", "<length>"],
        "box-decoration-break": ["slice", "clone"],
        "box-shadow": ["none", "<length> <length> <length> <length> <color> inset"],
        "box-sizing": ["content-box", "padding-box", "border-box", "padding-box"],
        "break-before": ["auto", "right", "page", "left", "column", "avoid-page", "avoid-column", "avoid", "always"],
        "break-after": ["auto", "right", "page", "left", "column", "avoid-page", "avoid-column", "avoid", "always"],
        "break-inside": ["auto", "avoid-page", "avoid-column", "avoid"],
        "caption-side": ["top", "bottom"],
        "clear": ["none", "right", "left", "both"],
        "clear-after": ["none", "top", "start", "right", "outside", "left", "inside", "end", "descendants", "bottom", "both"],
        "column-fill": ["balance", "auto"],
        "column-span": ["none", "all"],
        "column-width": ["auto", "<length>"],
        "column-count": ["auto", "<integer>"],
        "column-gap": ["normal", "<length>"],
        "column-rule": ["[column-rule-width] [column-rule-style] [column-rule-color]"],
        "column-rule-color": ["<color>"],
        "column-rule-style": ["none", "solid", "ridge", "outset", "inset", "hidden", "groove", "double", "dotted", "dashed"],
        "column-rule-width": ["medium", "thin", "thick", "<length>"],
        "columns": ["[column-width] [column-count]"],
        "content": ["normal", "open-quote", "none", "no-open-quote", "no-close-quote", "icon", "close-quote", ":before", ":after"],
        "counter-increment": ["none", "<integer>"],
        "counter-reset": ["none", "<integer>"],
        "cursor": ["auto", "zoom-out", "zoom-in", "wait", "w-resize", "vertical-text", "url(\"path/file.png\")", "text", "sw-resize", "se-resize", "s-resize", "row-resize", "progress", "pointer", "nwse-resize", "nw-resize", "ns-resize", "not-allowed", "none", "no-drop", "nesw-resize", "ne-resize", "n-resize", "move", "help", "ew-resize", "e-resize", "default", "crosshair", "copy", "context-menu", "col-resize", "cell", "all-scroll", "alias"],
        "display": ["inline", "table-row-group", "table-row", "table-header-group", "table-footer-group", "table-column-group", "table-column", "table-cell", "table-caption", "table", "run-in", "run-in", "none", "list-item", "inline-table", "inline-flex", "inline-block", "flex", "container", "compact", "block"],
        "empty-cells": ["show", "hide"],
        "float": ["none", "right", "left"],
        "flex": ["[flex-grow] [flex-shrink] [flex-basis]", "none"],
        "flex-basis": ["auto", "<length>"],
        "flex-direction": ["row", "row-reverse", "column-reverse", "column"],
        "flex-flow": ["[flex-direction] [flex-wrap]"],
        "flex-grow": ["0", "<number>"],
        "flex-shrink": ["1", "<number>"],
        "flex-wrap": ["nowrap", "wrap-reverse", "wrap"],
        "align-items": ["stretch", "flex-start", "flex-end", "center", "baseline"],
        "align-self": ["auto", "stretch", "flex-start", "flex-end", "center", "baseline"],
        "align-content": ["stretch", "space-between", "space-around", "flex-start", "flex-end", "center"],
        "justify-content": ["flex-start", "space-between", "space-around", "flex-end", "center"],
        //"filter": ["none", "sepia(<number> | <percentage>)", "saturate(<number> | <percentage>)", "opacity(<number> | <percentage>)", "invert(<number> | <percentage>)", "hue-rotate(<angle>)", "grayscale(<number> | <percentage>)", "drop-shadow(<length> <color>)", "contrast(<number> | <percentage>)", "brightness(<number> | <percentage>)", "blur(<length>)", "<url>"],
        "font": ["[font-style] [font-variant] [font-weight] [font-stretch] [font-size] / [line-height] "],
        //"font-family": ["<family-name>"],
        //"font-feature-settings": ["normal", "<feature-tag-value>"],
        "font-size": ["medium", "xx-small", "xx-large", "x-small", "x-large", "smaller", "small", "larger", "large", "<percentage>", "<length>"],
        "font-stretch": ["normal", "ultra-expanded", "ultra-condensed", "semi-expanded", "semi-condensed", "extra-expanded", "extra-condensed", "expanded", "condensed"],
        "font-size-adjust": ["none", "<number>"],
        "font-synthesis": ["weight style", "weight", "style", "none"],
        "font-kerning": ["auto", "normal", "none"],
        "font-variant": ["normal", "unicase", "titling-caps", "small-caps", "petite-caps", "all-small-caps", "all-petite-caps"],
        "font-variant-caps": ["normal", "unicase", "titling-caps", "small-caps", "petite-caps", "all-small-caps", "all-petite-caps"],
        "font-style": ["normal", "oblique", "italic"],
        "font-weight": ["normal", "lighter", "bolder", "bold", "900", "800", "700", "600", "500", "400", "300", "200", "100"],
        "hanging-punctuation": ["none", "last force-end", "last allow-end", "last", "force-end", "first force-end", "first allow-end", "first", "allow-end"],
        "height": ["auto", "<percentage>", "<length>"],
        "hyphens": ["manual", "none", "auto"],
        "image-rendering": ["auto", "pixelated", "crisp-edges"],
        "image-resolution": ["1dppx", "snap", "from-image"],
        //"image-orientation": ["0deg", "from-image", "<angle> flip", "<angle>"],
        "isolation": ["auto", "isolate"],
        "letter-spacing": ["normal", "<length>"],
        "line-break": ["auto", "strict", "normal", "loose"],
        "line-height": ["normal", "<percentage>", "<number>", "<length>"],
        "list-style": ["[list-style-type] [list-style-position]"],
        //"list-style-image": ["none", "<url>"],
        "list-style-position": ["outside", "inside"],
        "list-style-type": ["disc", "upper-roman", "upper-latin", "upper-alpha", "square", "none", "lower-roman", "lower-latin", "lower-greek", "lower-alpha", "georgian", "decimal-leading-zero", "decimal", "circle", "armenian"],
        "margin": ["[margin-top] [margin-right] [margin-bottom] [margin-left]"],
        "margin-left": ["0", "auto", "<percentage>", "<length>"],
        "margin-right": ["0", "auto", "<percentage>", "<length>"],
        "margin-top": ["0", "auto", "<percentage>", "<length>"],
        "margin-bottom": ["0", "auto", "<percentage>", "<length>"],
        "mask-type": ["luminance", "alpha"],
        "max-height": ["none", "<percentage>", "<length>"],
        "max-width": ["none", "<percentage>", "<length>"],
        "min-height": ["0", "auto", "<percentage>", "<length>"],
        "min-width": ["0", "auto", "<percentage>", "<length>"],
        "mix-blend-mode": ["normal", "soft-light", "screen", "saturation", "overlay", "multiply", "luminosity", "lighten", "hue", "hard-light", "exclusion", "difference", "darken", "color-dodge", "color-burn", "color"],
        "object-fit": ["fill", "scale-down", "none", "cover", "contain"],
        "object-position": ["50% 50%", "right bottom", "left top", "center center", "<percentage> <length>"],
        "opacity": ["1", "<number>"],
        "orphans": ["2", "<integer>"],
        "outline": ["[outline-color] [outline-style] [outline-width]"],
        "outline-color": ["invert", "<color>", "invert"],
        "outline-offset": ["0", "<length>"],
        "outline-style": ["none", "solid", "ridge", "outset", "inset", "groove", "double", "dotted", "dashed", "auto"],
        "outline-width": ["medium", "thin", "thick", "<length>"],
        "overflow": ["visible", "scroll", "hidden", "auto"],
        "overflow-x": ["visible", "scroll", "hidden", "auto"],
        "overflow-y": ["visible", "scroll", "hidden", "auto"],
        "overflow-wrap": ["normal", "break-word", "word-wrap"],
        "padding": ["[padding-top] [padding-right] [padding-bottom] [padding-left]"],
        "padding-top": ["0", "<percentage>", "<length>"],
        "padding-bottom": ["0", "<percentage>", "<length>"],
        "padding-left": ["0", "<percentage>", "<length>"],
        "padding-right": ["0", "<percentage>", "<length>"],
        "page-break-after": ["auto", "right", "left", "avoid", "always"],
        "page-break-before": ["auto", "right", "left", "avoid", "always"],
        "page-break-inside": ["auto", "avoid"],
        "perspective": ["none", "<length>"],
        "perspective-origin": ["50% 50%", "top", "right", "left", "center", "bottom", "<percentage>", "<length>"],
        "pointer-events": ["auto", "none"],
        //"quotes": ["none", "<string> <string>", ":before", ":after"],
        "resize": ["none", "vertical", "horizontal", "both"],
        "scroll-behavior": ["auto", "smooth"],
        "scroll-snap-coordinate": ["none", "right bottom", "margin-box", "left center", "border-box", "<percentage> <length>", "border-box", "margin-box"],
        "scroll-snap-destination": ["0px 0px", "top bottom", "left right", "center center", "<length> <percentage>"],
        "scroll-snap-type": ["none", "proximity", "mandatory"],
        "tab-size": ["8", "<length>", "<integer>"],
        "table-layout": ["auto", "fixed"],
        "text-align": ["start end", "start", "right", "match-parent", "left", "justify", "end", "center"],
        "text-align-last": ["auto", "start", "right", "left", "justify", "end", "center"],
        "text-combine-upright": ["none", "digits <integer>", "all", "-webkit-text-combine"],
        "text-decoration": ["[text-decoration-line] [text-decoration-style] [text-decoration-color]"],
        "text-decoration-color": ["<currentColor>", "<color>"],
        "text-decoration-line": ["none", "underline", "overline", "line-through", "blink"],
        "text-decoration-skip": ["none", "spaces", "objects", "ink", "edges", "box-decoration"],
        "text-decoration-style": ["solid", "wavy", "double", "dotted", "dashed"],
        "text-emphasis": ["[text-emphasis-style] [text-emphasis-color]", "text-emphasis-position"],
        "text-emphasis-style": ["none", "triangle", "sesame", "open", "filled", "double-circle", "dot", "circle"],
        "text-emphasis-color": ["<currentColor>", "<color>"],
        "text-emphasis-position": ["over right", "over left", "below right", "below left"],
        "text-indent": ["0", "<percentage>", "<length> hanging each-line", "<length> hanging", "<length> each-line", "<length>"],
        "text-justify": ["auto", "none", "inter-word", "distribute"],
        "text-orientation": ["mixed", "use-glyph-orientation", "upright", "sideways-right", "sideways-left", "sideways"],
        "text-overflow": ["clip", "ellipsis"],
        "text-rendering": ["auto", "optimizeSpeed", "optimizeLegibility", "geometricPrecision"],
        "text-shadow": ["none", "<length> <length> <length> <color>"],
        "text-underline-position": ["auto", "under right", "under left", "under", "right", "left"],
        "touch-action": ["auto", "pan-y", "pan-y", "pan-x", "pan-up", "pan-right", "pan-left", "pan-down", "none", "manipulation"],
        //"transform": ["none", "translateZ(<length>)", "translateY(<translation-value>)", "translateX(<translation-value>)", "translate3d(<translation-value>, <translation-value>, <length>)", "translate(<translation-value>, <translation-value>)", "skewY(<angle>)", "skewX(<angle>)", "scaleZ(<number>)", "scaleY(<number>)", "scaleX(<number>)", "scale3d(<number>, <number>, <number>)", "scale(<number>)", "rotateZ(<angle>)", "rotateY(<angle>)", "rotateX(<angle>)", "rotate3d(<number>, <number>, <number>, <angle>)", "rotate(<angle>)", "perspective(<length>)", "matrix3d([16 comma-separated <number> values])", "matrix([<number>, <number>, <number>, <number>, <number>, <number>])"],
        "transform-box": ["border-box", "view-box", "fill-box"],
        "transform-origin": ["50% 50%", "top", "right", "left", "center", "bottom", "<percentage>", "<length>"],
        "transform-style": ["flat", "preserve-3d"],
        "text-transform": ["none", "uppercase", "lowercase", "full-width", "capitalize", "full-width"],
        "transition": ["[transition-property] [transition-duration] [transition-timing-function] "],
        "transition-property": ["all", "none"],
        "transition-timing-function": ["ease", "steps(<integer>, start)", "steps(<integer>, end)", "steps(<integer>)", "step-start", "step-end", "linear", "ease-out", "ease-in-out", "ease-in", "cubic-bezier(<number>, <number>, <number>, <number>)"],
        "transition-duration": ["0s", "<time>"],
        "unicode-bidi": ["normal", "embed", "bidi-override"],
        "vertical-align": ["baseline", "top", "text-top", "text-bottom", "super", "sub", "middle", "bottom", "<percentage>", "<length>"],
        "white-space": ["normal", "pre-wrap", "pre-line", "pre", "nowrap", "pre-wrap", "pre-line"],
        "widows": ["2", "<integer>"],
        "will-change": ["auto", "scroll-position", "contents"],
        "word-break": ["normal", "keep-all", "break-all"],
        "word-spacing": ["normal", "<percentage>", "<length>"],
        "word-wrap": ["normal", "break-word", "overflow-wrap"],
        "writing-mode": ["horizontal-tb", "vertical-rl", "vertical-lr"],
        "z-index": ["auto", "<integer>"],
        "help": ["<length>", "inherit", "initial"]
    }


}

