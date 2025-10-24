import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { createCase } from "../../serviceWorkers/caseServices";

const CreateCase = () => {
    const { user } = useContext(AppContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "new",
        priority: "medium",
        user: user.id,
        due_date: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            alert("Please enter a case title");
            return false;
        }

        if (!formData.description.trim()) {
            alert("Please provide a detailed description of the cyber incident");
            return false;
        }

        if (!formData.user) {
            alert("Please enter your User ID");
            return false;
        }

        if (!formData.due_date) {
            alert("Please select a due date for resolution");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const caseData = {
                ...formData,
                due_date: new Date(formData.due_date).toISOString(),
            };

            console.log("Case Data:", caseData);
            createCase(formData)
                .then(response => {
                    if (response.status == 200 || response.status == 201) {
                        alert("Case filed successfully");
                        setFormData({
                            title: "",
                            description: "",
                            status: "new",
                            priority: "medium",
                            user: user.id,
                            due_date: "",
                        });
                    }
                })
                .catch(e => console.log(e.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
            <div className="w-full max-w-2xl bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Create New Cyber Case
                </h2>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Case Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g., Phishing Attack on Employee Email"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Incident Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Describe the cyber incident in detail — e.g., user received a suspicious email that led to credential compromise..."
                        />
                    </div>

                    {/* Status + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Case Status
                            </label>
                            <select
                                disabled  
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="new">New</option>
                                <option value="in_progress">Under Investigation</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Threat Severity
                            </label>
                            <select
                                name="priority"
                                id="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* User ID + Due Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="user"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Agent ID
                            </label>
                            <input
                                disabled
                                type="number"
                                name="user"
                                id="user"
                                value={formData.user}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Enter your User ID (e.g., 102)"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="due_date"
                                className="block text-gray-700 font-medium mb-1"
                            >
                                Expected Resolution Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                id="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 px-4 rounded-md bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                    >
                        Submit Cyber Case
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCase;
