import { useState } from "react";

export function SmileyContent() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`transition-transform hover:scale-110 ${isHovered ? "cursor-question" : ""}`}
        >
            {isHovered ? ":-(" : ":-)"}
        </div>
    );
}
