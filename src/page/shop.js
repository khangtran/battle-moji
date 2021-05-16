import React from "react";
import { ListWrap, UIPage } from "../Component";

const list_skill = [{ name: 'Hàn băng', des: 'Đóng băng đối phương', type: 'time', affect: 3, isActive: true, require: 2, img: 'skill_6.png' },
{ name: 'Tê liệt', des: 'Gây choáng đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_2.png' },
{ name: 'Sock ', des: 'Gây mù đối phương', type: 'time', affect: 2, isActive: true, require: 2, img: 'skill_4.png' },
{ name: 'Khai sáng', des: 'Tiêu diệt kí tự khi va chạm', type: 'obj', affect: 5, isActive: true, require: 3, img: 'skill_3.png' },
{ name: 'Hỏa ngục', des: 'Tiêu diệt tất cả kí tự hiện có', type: 'hp', affect: 1, isActive: true, require: 3, img: 'skill_1.png' },
{ name: 'Tối cường', des: 'Tăng sát thuơng thêm ', type: 'hp', affect: 1, isActive: true, require: 3, img: 'skill_5.png' }
]

export default class ShopPage extends UIPage {
    render() {
        return <React.Fragment>
            <ListWrap data={list_skill} />
        </React.Fragment>
    }
}