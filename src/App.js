import "./App.css";
import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:4000";

export default function Portfolio() {
  const [isEditing, setIsEditing] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`);
      const data = await res.json();

      const safeData = {
        ...data,
        education: (data.education || []).map((e) =>
          e || { institution: "", degree: "", board: "", startDate: "", endDate: "", cgpa: "", percentage: "" }
        ),
        experience: (data.experience || []).map((e) =>
          e || { company: "", role: "", location: "", startDate: "", endDate: "", responsibilities: [] }
        ),
        projects: (data.projects || []).map((p) =>
          p || { name: "", description: [], technologies: [], deployment: "" }
        ),
        certifications: (data.certifications || []).map((c) => c || ""),
        skills: data.skills || {
          languages: [],
          dsa: "",
          frontend: [],
          backend: [],
          database: []
        },
      };

      setProfile(safeData);
      setFormData(safeData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      await fetch(`${API_URL}/profile/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setProfile(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNestedChange = (section, index, key, value) => {
    const updated = [...formData[section]];
    if (key) {
      updated[index][key] = value;
    } else {
      updated[index] = value;
    }
    setFormData({ ...formData, [section]: updated });
  };

  const addArrayItem = (section, template) => {
    setFormData({ ...formData, [section]: [...formData[section], template] });
  };

  const removeArrayItem = (section, index) => {
    const updated = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  if (!formData) return <p>Loading...</p>;

  const allSkills = [
    ...(formData.skills?.languages || []),
    formData.skills?.dsa || "",
    ...(formData.skills?.frontend || []),
    ...(formData.skills?.backend || []),
    ...(formData.skills?.database || []),
  ].filter(Boolean);

  const filteredSkills = allSkills.filter((skill) =>
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const filteredProjects = formData.projects.filter((p) => {
    const search = searchProject.toLowerCase();
    return (
      (p.name?.toLowerCase() || "").includes(search) ||
      (p.description?.join(" ").toLowerCase() || "").includes(search) ||
      (p.technologies?.join(" ").toLowerCase() || "").includes(search) ||
      (p.deployment?.toLowerCase() || "").includes(search)
    );
  });

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>About Me</h1>
          <button onClick={handleEdit} className={`btn ${isEditing ? "save" : "edit"}`}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <div className="form">
            {/* Personal Info */}
            <input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your Name"
            />
            <input
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
            />
            <input
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Phone"
            />
            <textarea
              value={formData.summary || ""}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Summary"
            />

            {/* Education */}
            <h3>Education</h3>
            {formData.education.map((edu, i) => (
              <div key={i} className="input-row">
                <input placeholder="Institution" value={edu.institution || ""} onChange={(e) => handleNestedChange("education", i, "institution", e.target.value)} />
                <input placeholder="Degree" value={edu.degree || ""} onChange={(e) => handleNestedChange("education", i, "degree", e.target.value)} />
                <input placeholder="Board" value={edu.board || ""} onChange={(e) => handleNestedChange("education", i, "board", e.target.value)} />
                <input placeholder="Start Date" value={edu.startDate || ""} onChange={(e) => handleNestedChange("education", i, "startDate", e.target.value)} />
                <input placeholder="End Date" value={edu.endDate || ""} onChange={(e) => handleNestedChange("education", i, "endDate", e.target.value)} />
                <input placeholder="CGPA" value={edu.cgpa || ""} onChange={(e) => handleNestedChange("education", i, "cgpa", e.target.value)} />
                <input placeholder="Percentage" value={edu.percentage || ""} onChange={(e) => handleNestedChange("education", i, "percentage", e.target.value)} />
                <button className="btn delete" onClick={() => removeArrayItem("education", i)}>X</button>
              </div>
            ))}
            <button className="btn add" onClick={() => addArrayItem("education", { institution: "", degree: "", board: "", startDate: "", endDate: "", cgpa: "", percentage: "" })}>
              Add Education
            </button>

            {/* Experience */}
            <h3>Experience</h3>
            {formData.experience.map((exp, i) => (
              <div key={i} className="input-row">
                <input placeholder="Company" value={exp.company || ""} onChange={(e) => handleNestedChange("experience", i, "company", e.target.value)} />
                <input placeholder="Role" value={exp.role || ""} onChange={(e) => handleNestedChange("experience", i, "role", e.target.value)} />
                <input placeholder="Location" value={exp.location || ""} onChange={(e) => handleNestedChange("experience", i, "location", e.target.value)} />
                <input placeholder="Start Date" value={exp.startDate || ""} onChange={(e) => handleNestedChange("experience", i, "startDate", e.target.value)} />
                <input placeholder="End Date" value={exp.endDate || ""} onChange={(e) => handleNestedChange("experience", i, "endDate", e.target.value)} />
                <textarea placeholder="Responsibilities (comma separated)" value={exp.responsibilities.join(", ")} onChange={(e) => handleNestedChange("experience", i, "responsibilities", e.target.value.split(","))} />
                <button className="btn delete" onClick={() => removeArrayItem("experience", i)}>X</button>
              </div>
            ))}
            <button className="btn add" onClick={() => addArrayItem("experience", { company: "", role: "", location: "", startDate: "", endDate: "", responsibilities: [] })}>
              Add Experience
            </button>

            {/* Skills */}
            <h3>Skills</h3>
            <input placeholder="Languages (comma separated)" value={formData.skills.languages.join(", ")} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, languages: e.target.value.split(",") } })} />
            <input placeholder="DSA" value={formData.skills.dsa || ""} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, dsa: e.target.value } })} />
            <input placeholder="Frontend (comma separated)" value={formData.skills.frontend.join(", ")} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, frontend: e.target.value.split(",") } })} />
            <input placeholder="Backend (comma separated)" value={formData.skills.backend.join(", ")} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, backend: e.target.value.split(",") } })} />
            <input placeholder="Database (comma separated)" value={formData.skills.database.join(", ")} onChange={(e) => setFormData({ ...formData, skills: { ...formData.skills, database: e.target.value.split(",") } })} />

            {/* Projects */}
            <h3>Projects</h3>
            {formData.projects.map((proj, i) => (
              <div key={i} className="input-row">
                <input placeholder="Project Name" value={proj.name || ""} onChange={(e) => handleNestedChange("projects", i, "name", e.target.value)} />
                <textarea placeholder="Description (comma separated)" value={proj.description.join(", ")} onChange={(e) => handleNestedChange("projects", i, "description", e.target.value.split(","))} />
                <input placeholder="Technologies (comma separated)" value={proj.technologies.join(", ")} onChange={(e) => handleNestedChange("projects", i, "technologies", e.target.value.split(","))} />
                <input placeholder="Deployment Link" value={proj.deployment || ""} onChange={(e) => handleNestedChange("projects", i, "deployment", e.target.value)} />
                <button className="btn delete" onClick={() => removeArrayItem("projects", i)}>X</button>
              </div>
            ))}
            <button className="btn add" onClick={() => addArrayItem("projects", { name: "", description: [], technologies: [], deployment: "" })}>
              Add Project
            </button>

            {/* Certifications */}
            <h3>Certifications</h3>
            {formData.certifications.map((cert, i) => (
              <div key={i} className="input-row">
                <input placeholder="Certification" value={cert || ""} onChange={(e) => handleNestedChange("certifications", i, null, e.target.value)} />
                <button className="btn delete" onClick={() => removeArrayItem("certifications", i)}>X</button>
              </div>
            ))}
            <button className="btn add" onClick={() => addArrayItem("certifications", "")}>
              Add Certification
            </button>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Summary:</strong> {profile.summary}</p>

            <h3>Education</h3>
            <ul>
              {profile.education?.map((edu, i) => (
                <li key={i}>{edu.degree} at {edu.institution} ({edu.startDate} - {edu.endDate})</li>
              ))}
            </ul>

            <h3>Experience</h3>
            <ul>
              {profile.experience?.map((exp, i) => (
                <li key={i}>{exp.role} at {exp.company} ({exp.startDate} - {exp.endDate})</li>
              ))}
            </ul>

            <h3>Skills</h3>
            <input
              className="search"
              placeholder="Search Skills..."
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
            />
            <div className="tags">
              {filteredSkills.map((skill, i) => (
                <span key={i} className="tag">{skill}</span>
              ))}
            </div>

            <h3>Projects</h3>
            <input
              className="search"
              placeholder="Search Projects..."
              value={searchProject}
              onChange={(e) => setSearchProject(e.target.value)}
            />
            <ul>
              {filteredProjects.map((proj, i) => (
                <li key={i}>
                  <strong>{proj.name}</strong> <br />
                  {proj.description?.join(", ")} <br />
                  <em>Tech:</em> {proj.technologies?.join(", ")} <br />
                  {proj.deployment && (
                    <a href={proj.deployment} target="_blank" rel="noreferrer">{proj.deployment}</a>
                  )}
                </li>
              ))}
            </ul>

            <h3>Certifications</h3>
            <ul>
              {profile.certifications?.map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
