import React, { useState, useEffect } from 'react';
import { Post, Fetch, Delete } from "../utils/Api";

const SkillsManager = () => {
    // État pour stocker les compétences
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [softskills, setSoftskills] = useState([]);
    const [newSoftskill, setNewSoftskills] = useState('');

    // Charger les compétences depuis l'API
    useEffect(() => {
        fetchSkills();
        fetchSoftskills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await Fetch('/api/skill');
            setSkills(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des compétences :", error);
        }
    };
    const fetchSoftskills = async () => {
        try {
            const response = await Fetch('/api/soft-skill');
            setSoftskills(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des compétences :", error);
        }
    };

    // Ajouter une nouvelle compétence
    const handleAddSkill = async () => {
        if (newSkill.trim()) {
            try {
                const response = await Post('/api/skill/create', { label: newSkill });
                setSkills([...skills, response.data]);
                setNewSkill('');
            } catch (error) {
                console.error("Erreur lors de l'ajout de la compétence :", error);
            }
        }
    };
    const handleAddSoftskill = async () => {
        if (newSoftskill.trim()) {
            try {
                const response = await Post('/api/soft-skill/create', { label: newSoftskill });
                setSoftskills([...softskills, response.data]);
                setNewSoftskills('');
            } catch (error) {
                console.error("Erreur lors de l'ajout de la compétence :", error);
            }
        }
    };

    // Supprimer une compétence
    const handleDeleteSkill = async (skillId) => {
        try {
            console.log(skillId)
            await Delete(`/api/skill/${skillId}`);
            setSkills(skills.filter(skill => skill.id !== skillId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la compétence :", error);
        }
    };
    const handleDeleteSoftskill = async (softskillId) => {
        try {
            console.log(softskillId)
            await Delete(`/api/soft-skill/${softskillId}`);
            setSoftskills(softskills.filter(softskills => softskills.id !== softskillId));
        } catch (error) {
            console.error("Erreur lors de la suppression de la compétence :", error);
        }
    };

    return (
        <div className="container">
            <div style={{ display: "flex"}}>
                <div style={{ width: "50%"}}>
                    <div className='skills-manager'>
                    <h2>Gestion des Compétences</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Nouvelle compétence"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button onClick={handleAddSkill}>
                            {'Ajouter'}
                        </button>
                    </div>
                    <ul>
                        {skills.map((skill) => (
                            <li key={skill.id}>
                                {skill.label}
                                <button onClick={() => handleDeleteSkill(skill.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
                <div style={{ width: "50%"}}>
                    <div className='skills-manager'>
                    <h2>Gestion des Softskills</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Nouveau softskill"
                            value={newSoftskill}
                            onChange={(f) => setNewSoftskills(f.target.value)}
                        />
                        <button onClick={handleAddSoftskill}>
                            {'Ajouter'}
                        </button>
                    </div>
                    <ul>
                        {softskills.map((softskills) => (
                            <li key={softskills.id}>
                                {softskills.label}
                                <button onClick={() => handleDeleteSoftskill(softskills.id)}>Supprimer</button>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillsManager;
