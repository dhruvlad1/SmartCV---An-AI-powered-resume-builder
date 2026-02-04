// src/services/resumeService.js

export const getResumes = async () => {
  // mock existing resumes
  return [
    { _id: "1", title: "My Resume 1" },
    { _id: "2", title: "My Resume 2" },
  ];
};

export const createResume = async () => {
  // mock new resume creation
  return { _id: "new-resume-id" };
};

export const setTemplate = async (resumeId, template) => {
  console.log("Template saved:", resumeId, template);
  return true;
};
