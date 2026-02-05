// src/services/resumeService.js

export const getResumes = async () => {
  // Mock existing resumes with detailed data
  return [
    {
      _id: "1",
      title: "Software Engineer Resume",
      template: "jakes-classic",
      lastEdited: "2024-01-15",
      createdAt: "2023-12-01",
    },
    {
      _id: "2",
      title: "Product Manager Resume",
      template: "modern",
      lastEdited: "2024-01-10",
      createdAt: "2023-11-15",
    },
    {
      _id: "3",
      title: "Data Scientist Resume",
      template: "minimal",
      lastEdited: "2024-01-05",
      createdAt: "2023-10-20",
    },
  ];
};

export const createResume = async () => {
  // Mock new resume creation
  const newId = `resume-${Date.now()}`;
  return { _id: newId };
};

export const setTemplate = async (resumeId, template) => {
  console.log("Template saved:", resumeId, template);
  return true;
};
