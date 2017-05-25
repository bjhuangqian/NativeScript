import { getSetProperties } from "../ui/core/properties";
import { ViewBase } from "../ui/core/view";

const propertyBlacklist = [
    "effectivePaddingLeft",
    "effectivePaddingBottom",
    "effectivePaddingRight",
    "effectivePaddingTop"
]


export const ELEMENT_NODE_TYPE = 1;
export const ROOT_NODE_TYPE = 9;
export class DOMNode {
    nodeId;
    nodeType;
    nodeName;
    localName;
    nodeValue = '';
    // _children: Node[] = [];
    attributes = [];

    constructor(private view: ViewBase) {

        this.nodeType = view.typeName === "Frame" ? ROOT_NODE_TYPE : ELEMENT_NODE_TYPE;
        this.nodeId = view._domId;
        this.nodeName = view.typeName;
        this.localName = this.nodeName;

        // view.eachChild((child) => {
        //     this.children.push(new Node(child, ELEMENT_NODE_TYPE));
        //     return true;
        // });

        // console.log("~~~~~~~~~~~~~~ View: " + view);
        this.getAttributes(view, this.attributes);
    }

    get children(): DOMNode[] {
        const res = [];
        this.view.eachChild((child) => {
            child.ensureDomElement();
            res.push(child.domNode);
            return true;
        });

        return res;
    }

    public print() {
        return {
            nodeId: this.nodeId,
            nodeType: this.nodeType,
            nodeName: this.nodeName,
            localName: this.localName,
            nodeValue: this.nodeValue,
            children: this.children.map(c => c.print()),
            attributes: this.attributes
        };
    };

    public getAttributes(view, attrs) {
        const props = getSetProperties(view).filter(pair => {
            const name = pair[0];
            const value = pair[1];

            if (name[0] === "_" || typeof value === "object") {
                return false;
            }

            if (propertyBlacklist.indexOf(name) >= 0) {
                return false;
            }

            return true;
        });

        props.forEach(pair => attrs.push(pair[0], pair[1]));
    }


    onChildAdded(view: ViewBase, atIndex?: number): void {
        console.log("onChildAdded: " + view + " at: " + atIndex)
    }

    onChildRemoved(view: ViewBase): void {
        console.log("onChildRemoved: " + view)
    }

}

declare function domChanged();