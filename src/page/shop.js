import React from "react";
import { ListWrap, UIPage } from "../Component";

const list_skill = []

export default class ShopPage extends UIPage {
    render() {
        return <React.Fragment>
            <ListWrap data={list_skill} />
        </React.Fragment>
    }
}