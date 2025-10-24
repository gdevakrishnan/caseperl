import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { createCase } from "../../serviceWorkers/caseServices";
import { Shield, AlertCircle, Calendar, User } from 'lucide-react';

const CreateCase = () => {
    const { user, setMessage, setError } = useContext(AppContext);

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
            setError("Please enter a case title");
            return false;
        }

        if (!formData.description.trim()) {
            setError("Please provide a detailed description of the cyber incident");
            return false;
        }

        if (!formData.user) {
            setError("Please enter your User ID");
            return false;
        }

        if (!formData.due_date) {
            setError("Please select a due date for resolution");
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
                        setMessage("Case filed successfully");
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
                .catch((e) => {
                    setError(e.message);
                    console.log(e.message);
                })
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create Cyber Case
                    </h1>
                    <p className="text-gray-600">
                        Document and track cybersecurity incidents
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-8 py-6">
                        <h2 className="text-xl font-semibold text-white">
                            Incident Details
                        </h2>
                        <p className="text-emerald-50 text-sm mt-1">
                            Fill in the information below to create a new case
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Case Title */}
                        <div>
                            <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                <AlertCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                Case Title
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-gray-400"
                                placeholder="e.g., Phishing Attack on Employee Email"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                Incident Description
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors resize-none placeholder:text-gray-400"
                                placeholder="Describe the cyber incident in detail — e.g., user received a suspicious email that led to credential compromise..."
                            />
                        </div>

                        {/* Status + Priority Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Priority */}
                            <div>
                                <label htmlFor="priority" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    Threat Severity
                                </label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        id="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors bg-gray-50 text-gray-600 placeholder:text-gray-400"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>

                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    </div>
                                </div>

                            </div>

                            {/* Due date */}
                            <div>
                                <label htmlFor="due_date" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                                    Expected Resolution Date
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="due_date"
                                    id="due_date"
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                className="w-full py-4 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <Shield className="w-5 h-5" />
                                Submit Cyber Case
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCase;
