import React from "react"
import "./About.scss"
import Menu from "../components/Menu";
import { MenuItem } from "../models/MenuItemModel";

const About = () => {
    const menuItems: MenuItem[] = [
        { name: 'Home', link: '/Home' },
      ];

  return (
    <div className="mainContainer">
    <Menu items={menuItems}/>
      <div className="aboutContainer">
        <p>
            To use app you have to register and login. Then click "Start" and "new node" to create first node.
            After clicking on the node you can create nodes under the clicked node or switch "Notes Page" and
            create notes. 
        </p>
        <p>
            To navigate you can use "Node above" button or "Tree Overview" and then click on specific node.
            If nodes in "Tree Overview" exceed the screen you can navigate by holding left mouse button 
            and dragging.
        </p>
        <p>
            You can delete or edit nodes/notes by right clicking them.
        </p>
      </div>
    </div>
  )
};

export default About;
