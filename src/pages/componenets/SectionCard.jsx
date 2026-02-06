//Section cards are individual components in the Editor Panel for entering inputs
//Section card is made collapsible using isOpen

import "./Editor.css";
import "../App.css";
import { useState } from "react";

// Reusable section wrapper
// Props: title -> section header, children -> inputs inside section

const SectionCard = ({ title, children }) => {

    // Card is made collapsible. isOpen = true indicates the card is open. Initially all cards are closed
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="editor-section">
            <div className="editor-section-header" onClick={() => setIsOpen(!isOpen)}>
                <h3>{title}</h3>
                <span>{isOpen ? '-' : '+'}</span>
            </div>
            {isOpen && <div className="editor-section-body">{children}</div>}
        </div>
    )
}

export default SectionCard;