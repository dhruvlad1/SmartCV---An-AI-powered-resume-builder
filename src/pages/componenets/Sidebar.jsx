/* aside tag is used to indicate that the section is related to the main page but not the core content. */
/* nav tag indicates menu used to move around the website/app */

import { FaPen, FaPalette, FaArrowLeft, FaChartBar } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">

                {/* Back button */}
                <button className="sidebar-button">
                    <span className="sidebar-icon">
                        <FaArrowLeft></FaArrowLeft>
                    </span>
                    <span className="sidebar-button-text">
                        Back to <br /> All Resumes
                    </span>
                </button>

                {/*Edit Content button */}
                <button className="sidebar-button">
                    <span className="sidebar-icon">
                        <FaPen></FaPen>
                    </span>
                    <span className="sidebar-button-text">
                        Edit Content
                    </span>
                </button>

                {/*Customize Template button */}
                <button className="sidebar-button">
                    <span className="sidebar-icon">
                        <FaPalette></FaPalette>
                    </span>
                    <span className="sidebar-button-text">
                        Customize Template
                    </span>
                </button>

                {/*AI Mode button */}
                <button className="sidebar-button">
                    <span className="sidebar-icon">
                        <IoSparklesSharp></IoSparklesSharp>
                    </span>
                    <span className="sidebar-button-text">
                        AI Mode
                    </span>
                </button>

                {/*ATS Score button */}
                <button className="sidebar-button">
                    <span className="sidebar-icon">
                        <FaChartBar></FaChartBar>
                    </span>
                    <span className="sidebar-button-text">
                        ATS Score
                    </span>
                </button>

            </nav>
        </aside>
    )
}

export default Sidebar;