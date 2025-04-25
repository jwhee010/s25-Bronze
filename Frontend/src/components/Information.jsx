import React from "react";
import Navbar from "./Navbar";

export default function Information() {
  const resources = [
    {
      title: "Food Rescue US",
      description: "Volunteer-driven platform that delivers excess food to local agencies.",
      link: "https://foodrescue.us/",
    },
    {
      title: "Too Good To Go",
      description: "An app that helps save surplus food from restaurants and cafes.",
      link: "https://www.toogoodtogo.com/en-us",
    },
    {
      title: "EPA - Food Waste Resources",
      description: "Official U.S. Environmental Protection Agency guidance on reducing food waste.",
      link: "https://www.epa.gov/recycle/reducing-wasted-food-home",
    },
    {
      title: "Local Food Banks",
      description: "Many local food banks accept non-perishable donations and rescued surplus.",
      link: "https://www.feedingamerica.org/find-your-local-foodbank",
    },
  ];

  return (
    <div className="information-page">
      <Navbar/>
      <h2>Combat Food Waste: Helpful Resources</h2>
      <ul>
        {resources.map((resource, index) => (
          <li key={index} className="info-item">
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              Visit Site
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
