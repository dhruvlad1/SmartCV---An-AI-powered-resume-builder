import { useState, useEffect } from "react";
import "./ATSChecker.css";

// Utility functions for ATS analysis
const extractTextFromResume = (resumeData) => {
  let text = "";
  
  // Personal Info
  text += `${resumeData.name || ""} ${resumeData.title || ""} ${resumeData.email || ""} ${resumeData.phone || ""} ${resumeData.location || ""} ${resumeData.linkedin || ""} ${resumeData.github || ""} `;
  
  // Summary
  text += `${resumeData.summary || ""} `;
  
  // Experience
  if (resumeData.experience) {
    resumeData.experience.forEach(exp => {
      text += `${exp.role || ""} ${exp.company || ""} ${exp.location || ""} ${exp.year || ""} `;
      if (exp.description) {
        text += exp.description.join(" ") + " ";
      }
    });
  }
  
  // Education
  if (resumeData.education) {
    resumeData.education.forEach(edu => {
      text += `${edu.institute || ""} ${edu.degree || ""} ${edu.location || ""} ${edu.year || ""} ${edu.gpa || ""} `;
    });
  }
  
  // Skills
  if (resumeData.skills) {
    text += resumeData.skills.join(" ") + " ";
  }
  
  // Projects
  if (resumeData.projects) {
    resumeData.projects.forEach(proj => {
      text += `${proj.name || ""} ${proj.description || ""} ${proj.year || ""} `;
      if (proj.tech) {
        text += proj.tech.join(" ") + " ";
      }
    });
  }
  
  // Certifications
  if (resumeData.certifications) {
    text += resumeData.certifications.join(" ") + " ";
  }
  
  return text.toLowerCase().trim();
};

// Tokenize and normalize text
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2);
};

// Calculate TF-IDF vector for a document
const calculateTFIDF = (docTokens, allDocsTokens) => {
  const tf = {};
  const idf = {};
  const docLength = docTokens.length;
  
  // Calculate term frequency (TF)
  docTokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1 / docLength;
  });
  
  // Calculate inverse document frequency (IDF)
  const uniqueTokens = new Set(docTokens);
  uniqueTokens.forEach(token => {
    const docFreq = allDocsTokens.filter(doc => doc.includes(token)).length;
    idf[token] = Math.log(allDocsTokens.length / (docFreq + 1));
  });
  
  // Calculate TF-IDF
  const tfidf = {};
  Object.keys(tf).forEach(token => {
    tfidf[token] = tf[token] * (idf[token] || 0);
  });
  
  return tfidf;
};

// Calculate cosine similarity
const cosineSimilarity = (vec1, vec2) => {
  const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  keys.forEach(key => {
    const val1 = vec1[key] || 0;
    const val2 = vec2[key] || 0;
    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  });
  
  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

// Extract keywords from JD
const extractKeywords = (jdText) => {
  const tokens = tokenize(jdText);
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "should", "could", "may", "might", "must", "can", "this", "that", "these", "those"
  ]);
  
  const keywords = tokens.filter(token => !stopWords.has(token));
  const keywordFreq = {};
  keywords.forEach(keyword => {
    keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
  });
  
  // Return top keywords (appearing at least twice or top 20)
  const sorted = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word]) => word);
  
  return sorted;
};

// Detect keyword stuffing
const detectKeywordStuffing = (resumeText, keywords) => {
  const tokens = tokenize(resumeText);
  const keywordCounts = {};
  let totalKeywords = 0;
  
  keywords.forEach(keyword => {
    const count = tokens.filter(t => t === keyword || t.includes(keyword)).length;
    keywordCounts[keyword] = count;
    totalKeywords += count;
  });
  
  const density = totalKeywords / tokens.length;
  const isStuffing = density > 0.15; // More than 15% keywords is suspicious
  
  return { isStuffing, density, keywordCounts };
};

// Extract skills from resume
const extractSkills = (resumeData) => {
  const skills = [];
  
  // From skills section
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    skills.push(...resumeData.skills.map(s => s.toLowerCase().trim()));
  }
  
  // From projects tech stack
  if (resumeData.projects) {
    resumeData.projects.forEach(proj => {
      if (proj.tech && Array.isArray(proj.tech)) {
        skills.push(...proj.tech.map(t => t.toLowerCase().trim()));
      }
    });
  }
  
  // From experience descriptions
  if (resumeData.experience) {
    resumeData.experience.forEach(exp => {
      if (exp.description) {
        const descText = exp.description.join(" ").toLowerCase();
        // Common tech keywords
        const techKeywords = [
          "javascript", "python", "java", "react", "node", "sql", "mongodb", "aws", "docker",
          "kubernetes", "git", "html", "css", "typescript", "angular", "vue", "express",
          "django", "flask", "spring", "postgresql", "mysql", "redis", "graphql", "rest",
          "api", "microservices", "ci/cd", "jenkins", "terraform", "ansible"
        ];
        techKeywords.forEach(keyword => {
          if (descText.includes(keyword) && !skills.includes(keyword)) {
            skills.push(keyword);
          }
        });
      }
    });
  }
  
  return [...new Set(skills)]; // Remove duplicates
};

// Categorize skills
const categorizeSkills = (skills) => {
  const categories = {
    languages: [],
    frameworks: [],
    tools: [],
    databases: [],
    cloud: [],
    other: []
  };
  
  const languageKeywords = ["javascript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "typescript"];
  const frameworkKeywords = ["react", "angular", "vue", "node", "express", "django", "flask", "spring", "laravel", "rails", "next", "nuxt"];
  const toolKeywords = ["git", "docker", "kubernetes", "jenkins", "terraform", "ansible", "jira", "confluence"];
  const databaseKeywords = ["mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb"];
  const cloudKeywords = ["aws", "azure", "gcp", "heroku", "vercel", "netlify"];
  
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    if (languageKeywords.some(kw => skillLower.includes(kw))) {
      categories.languages.push(skill);
    } else if (frameworkKeywords.some(kw => skillLower.includes(kw))) {
      categories.frameworks.push(skill);
    } else if (toolKeywords.some(kw => skillLower.includes(kw))) {
      categories.tools.push(skill);
    } else if (databaseKeywords.some(kw => skillLower.includes(kw))) {
      categories.databases.push(skill);
    } else if (cloudKeywords.some(kw => skillLower.includes(kw))) {
      categories.cloud.push(skill);
    } else {
      categories.other.push(skill);
    }
  });
  
  return categories;
};

// Extract required skills from JD
const extractRequiredSkills = (jdText) => {
  const tokens = tokenize(jdText);
  const techKeywords = [
    "javascript", "python", "java", "react", "node", "sql", "mongodb", "aws", "docker",
    "kubernetes", "git", "html", "css", "typescript", "angular", "vue", "express",
    "django", "flask", "spring", "postgresql", "mysql", "redis", "graphql", "rest",
    "api", "microservices", "ci/cd", "jenkins", "terraform", "ansible", "azure", "gcp"
  ];
  
  return techKeywords.filter(keyword => 
    tokens.some(token => token.includes(keyword) || keyword.includes(token))
  );
};

// Check formatting and parse-ability
const checkFormatting = (resumeData) => {
  const issues = [];
  let score = 100;
  
  // Check for required sections
  const requiredSections = ["name", "email", "experience", "education"];
  requiredSections.forEach(section => {
    if (!resumeData[section] || 
        (Array.isArray(resumeData[section]) && resumeData[section].length === 0)) {
      issues.push(`Missing or empty ${section} section`);
      score -= 10;
    }
  });
  
  // Check contact info format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (resumeData.email && !emailRegex.test(resumeData.email)) {
    issues.push("Invalid email format");
    score -= 5;
  }
  
  const phoneRegex = /[\d\s\-\(\)\+]{10,}/;
  if (resumeData.phone && !phoneRegex.test(resumeData.phone)) {
    issues.push("Phone number format may not be ATS-friendly");
    score -= 5;
  }
  
  // Check LinkedIn URL
  if (resumeData.linkedin && !resumeData.linkedin.includes("linkedin.com")) {
    issues.push("LinkedIn URL format may be incorrect");
    score -= 3;
  }
  
  return { score: Math.max(0, score), issues };
};

// Detect action verbs and quantified impact
const detectActionVerbs = (resumeData) => {
  const actionVerbs = [
    "built", "created", "developed", "designed", "implemented", "optimized", "improved",
    "increased", "decreased", "reduced", "managed", "led", "achieved", "delivered",
    "executed", "launched", "established", "enhanced", "streamlined", "automated",
    "architected", "scaled", "transformed", "integrated", "collaborated", "mentored"
  ];
  
  let verbCount = 0;
  let quantifiedCount = 0;
  const foundVerbs = [];
  const quantifiedAchievements = [];
  
  // Check experience descriptions
  if (resumeData.experience) {
    resumeData.experience.forEach(exp => {
      if (exp.description) {
        exp.description.forEach(desc => {
          const descLower = desc.toLowerCase();
          
          // Check for action verbs
          actionVerbs.forEach(verb => {
            if (descLower.includes(verb) && !foundVerbs.includes(verb)) {
              foundVerbs.push(verb);
              verbCount++;
            }
          });
          
          // Check for quantified achievements (%, $, numbers, "x times")
          const quantPatterns = [
            /\d+%/, // Percentage
            /\$\d+/, // Dollar amounts
            /\d+x/, // Multipliers
            /\d+\s*(million|billion|thousand|k|m|b)/i, // Large numbers
            /increased|decreased|reduced|improved.*\d+/i // Verbs with numbers
          ];
          
          quantPatterns.forEach(pattern => {
            if (pattern.test(desc) && !quantifiedAchievements.includes(desc)) {
              quantifiedAchievements.push(desc);
              quantifiedCount++;
            }
          });
        });
      }
    });
  }
  
  // Check projects
  if (resumeData.projects) {
    resumeData.projects.forEach(proj => {
      if (proj.description) {
        const descLower = proj.description.toLowerCase();
        actionVerbs.forEach(verb => {
          if (descLower.includes(verb) && !foundVerbs.includes(verb)) {
            foundVerbs.push(verb);
            verbCount++;
          }
        });
      }
    });
  }
  
  const verbScore = Math.min(100, (verbCount / 5) * 100); // Target: 5+ verbs
  const quantScore = Math.min(100, (quantifiedCount / 3) * 100); // Target: 3+ quantified achievements
  
  return {
    verbCount,
    quantifiedCount,
    foundVerbs,
    quantifiedAchievements,
    verbScore,
    quantScore,
    overallScore: (verbScore + quantScore) / 2
  };
};

// Check structure and section recognition
const checkStructure = (resumeData) => {
  const sections = [];
  let score = 100;
  
  if (resumeData.name) sections.push("Name");
  if (resumeData.email || resumeData.phone) sections.push("Contact");
  if (resumeData.summary) sections.push("Summary");
  if (resumeData.experience && resumeData.experience.length > 0) sections.push("Experience");
  if (resumeData.education && resumeData.education.length > 0) sections.push("Education");
  if (resumeData.skills && resumeData.skills.length > 0) sections.push("Skills");
  if (resumeData.projects && resumeData.projects.length > 0) sections.push("Projects");
  if (resumeData.certifications && resumeData.certifications.length > 0) sections.push("Certifications");
  
  const standardSections = ["Name", "Contact", "Experience", "Education", "Skills"];
  const missingSections = standardSections.filter(sec => !sections.includes(sec));
  
  score -= missingSections.length * 20;
  
  return {
    sections,
    missingSections,
    score: Math.max(0, score)
  };
};

// Main ATS evaluation function
const evaluateATS = (resumeData, jdText = "") => {
  const resumeText = extractTextFromResume(resumeData);
  const resumeTokens = tokenize(resumeText);
  
  let results = {
    keywordMatch: { score: 0, details: {}, missingKeywords: [], keywordStuffing: null },
    skillsMatch: { score: 0, detectedSkills: [], requiredSkills: [], overlap: [], missingSkills: [], categories: {} },
    experienceRelevance: { score: 0, details: {} },
    formatting: { score: 100, issues: [] },
    actionVerbs: { score: 0, verbCount: 0, quantifiedCount: 0, foundVerbs: [], quantifiedAchievements: [] },
    structure: { score: 100, sections: [], missingSections: [] },
    overallScore: 0
  };
  
  // 1. Keyword Match (40%)
  if (jdText) {
    const jdTokens = tokenize(jdText);
    const keywords = extractKeywords(jdText);
    const resumeTFIDF = calculateTFIDF(resumeTokens, [resumeTokens, jdTokens]);
    const jdTFIDF = calculateTFIDF(jdTokens, [resumeTokens, jdTokens]);
    const similarity = cosineSimilarity(resumeTFIDF, jdTFIDF);
    
    const missingKeywords = keywords.filter(kw => 
      !resumeTokens.some(token => token.includes(kw) || kw.includes(token))
    );
    
    const keywordStuffing = detectKeywordStuffing(resumeText, keywords);
    
    results.keywordMatch = {
      score: Math.min(100, similarity * 100),
      similarity,
      missingKeywords: missingKeywords.slice(0, 20), // Top 20 missing
      keywordStuffing
    };
  } else {
    results.keywordMatch = { score: 50, message: "No Job Description provided" };
  }
  
  // 2. Skills Match (20%)
  const detectedSkills = extractSkills(resumeData);
  const requiredSkills = jdText ? extractRequiredSkills(jdText) : [];
  const overlap = detectedSkills.filter(skill => 
    requiredSkills.some(req => skill.includes(req) || req.includes(skill))
  );
  const missingSkills = requiredSkills.filter(req => 
    !detectedSkills.some(skill => skill.includes(req) || req.includes(skill))
  );
  
  const skillsScore = requiredSkills.length > 0 
    ? (overlap.length / requiredSkills.length) * 100 
    : 50;
  
  results.skillsMatch = {
    score: Math.min(100, skillsScore),
    detectedSkills,
    requiredSkills,
    overlap,
    missingSkills: missingSkills.slice(0, 15),
    categories: categorizeSkills(detectedSkills)
  };
  
  // 3. Experience Relevance (15%)
  if (jdText && resumeData.experience) {
    const jdLower = jdText.toLowerCase();
    let relevanceScore = 0;
    const expDetails = [];
    
    resumeData.experience.forEach(exp => {
      const expText = `${exp.role || ""} ${exp.company || ""} ${exp.description?.join(" ") || ""}`.toLowerCase();
      const jdTokens = tokenize(jdText);
      const expTokens = tokenize(expText);
      const commonTokens = jdTokens.filter(token => expTokens.includes(token));
      const relevance = commonTokens.length / Math.max(jdTokens.length, 1);
      
      expDetails.push({
        role: exp.role,
        company: exp.company,
        relevance: relevance * 100
      });
      
      relevanceScore += relevance;
    });
    
    results.experienceRelevance = {
      score: Math.min(100, (relevanceScore / Math.max(resumeData.experience.length, 1)) * 100),
      details: expDetails
    };
  } else {
    results.experienceRelevance = { score: 50, message: jdText ? "No experience data" : "No JD provided" };
  }
  
  // 4. Formatting & Parse-ability (10%)
  results.formatting = checkFormatting(resumeData);
  
  // 5. Action Verbs & Quantified Impact (10%)
  results.actionVerbs = detectActionVerbs(resumeData);
  
  // 6. Structure & Section Recognition (5%)
  results.structure = checkStructure(resumeData);
  
  // Calculate overall weighted score
  results.overallScore = Math.round(
    results.keywordMatch.score * 0.40 +
    results.skillsMatch.score * 0.20 +
    results.experienceRelevance.score * 0.15 +
    results.formatting.score * 0.10 +
    results.actionVerbs.overallScore * 0.10 +
    results.structure.score * 0.05
  );
  
  return results;
};

const ATSChecker = ({ resumeData, onClose }) => {
  const [jdText, setJdText] = useState("");
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    // Auto-analyze when component mounts or resumeData changes
    if (resumeData) {
      handleAnalyze();
    }
  }, [resumeData]);
  
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const evaluationResults = evaluateATS(resumeData, jdText);
      setResults(evaluationResults);
      setIsAnalyzing(false);
    }, 500);
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };
  
  return (
    <div className="ats-checker-panel">
      <div className="ats-header">
        <h2>ATS Checker</h2>
        <button className="ats-close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="ats-content">
        <div className="ats-jd-input">
          <label>Job Description (Optional)</label>
          <textarea
            placeholder="Paste the job description here for targeted analysis..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={4}
          />
          <button className="ats-analyze-btn" onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
        
        {results && (
          <div className="ats-results">
            <div className="ats-overall-score">
              <div className="score-circle" style={{ borderColor: getScoreColor(results.overallScore) }}>
                <span className="score-value" style={{ color: getScoreColor(results.overallScore) }}>
                  {results.overallScore}
                </span>
                <span className="score-label">ATS Score</span>
              </div>
            </div>
            
            <div className="ats-breakdown">
              <h3>Score Breakdown</h3>
              
              {/* Keyword Match */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Keyword Match</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.keywordMatch.score) }}>
                    {Math.round(results.keywordMatch.score)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.keywordMatch.score}%`,
                      backgroundColor: getScoreColor(results.keywordMatch.score)
                    }}
                  />
                </div>
                {results.keywordMatch.missingKeywords && results.keywordMatch.missingKeywords.length > 0 && (
                  <div className="metric-details">
                    <strong>Missing Keywords:</strong>
                    <div className="keyword-list">
                      {results.keywordMatch.missingKeywords.slice(0, 10).map((kw, i) => (
                        <span key={i} className="keyword-tag missing">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
                {results.keywordMatch.keywordStuffing?.isStuffing && (
                  <div className="metric-warning">
                    ⚠️ Keyword stuffing detected (density: {(results.keywordMatch.keywordStuffing.density * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
              
              {/* Skills Match */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Skills Match</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.skillsMatch.score) }}>
                    {Math.round(results.skillsMatch.score)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.skillsMatch.score}%`,
                      backgroundColor: getScoreColor(results.skillsMatch.score)
                    }}
                  />
                </div>
                <div className="metric-details">
                  <div>
                    <strong>Detected Skills ({results.skillsMatch.detectedSkills.length}):</strong>
                    <div className="keyword-list">
                      {results.skillsMatch.detectedSkills.slice(0, 15).map((skill, i) => (
                        <span key={i} className="keyword-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                  {results.skillsMatch.missingSkills && results.skillsMatch.missingSkills.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong>Missing Skills:</strong>
                      <div className="keyword-list">
                        {results.skillsMatch.missingSkills.map((skill, i) => (
                          <span key={i} className="keyword-tag missing">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Experience Relevance */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Experience Relevance</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.experienceRelevance.score) }}>
                    {Math.round(results.experienceRelevance.score)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.experienceRelevance.score}%`,
                      backgroundColor: getScoreColor(results.experienceRelevance.score)
                    }}
                  />
                </div>
              </div>
              
              {/* Formatting */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Formatting & Parse-ability</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.formatting.score) }}>
                    {Math.round(results.formatting.score)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.formatting.score}%`,
                      backgroundColor: getScoreColor(results.formatting.score)
                    }}
                  />
                </div>
                {results.formatting.issues && results.formatting.issues.length > 0 && (
                  <div className="metric-details">
                    <strong>Issues:</strong>
                    <ul className="issues-list">
                      {results.formatting.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Action Verbs */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Action Verbs & Quantified Impact</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.actionVerbs.overallScore) }}>
                    {Math.round(results.actionVerbs.overallScore)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.actionVerbs.overallScore}%`,
                      backgroundColor: getScoreColor(results.actionVerbs.overallScore)
                    }}
                  />
                </div>
                <div className="metric-details">
                  <div>Action Verbs Found: {results.actionVerbs.verbCount}</div>
                  <div>Quantified Achievements: {results.actionVerbs.quantifiedCount}</div>
                </div>
              </div>
              
              {/* Structure */}
              <div className="ats-metric">
                <div className="metric-header">
                  <span>Structure & Sections</span>
                  <span className="metric-score" style={{ color: getScoreColor(results.structure.score) }}>
                    {Math.round(results.structure.score)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ 
                      width: `${results.structure.score}%`,
                      backgroundColor: getScoreColor(results.structure.score)
                    }}
                  />
                </div>
                <div className="metric-details">
                  <div>Found Sections: {results.structure.sections.join(", ")}</div>
                  {results.structure.missingSections && results.structure.missingSections.length > 0 && (
                    <div style={{ marginTop: "10px", color: "#ef4444" }}>
                      Missing: {results.structure.missingSections.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Info Validation */}
            <div className="ats-contact-validation">
              <h3>Contact Information</h3>
              <div className="contact-item">
                <span>Email:</span>
                <span className={resumeData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email) ? "valid" : "invalid"}>
                  {resumeData.email || "Missing"} {resumeData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email) ? "✓" : "✗"}
                </span>
              </div>
              <div className="contact-item">
                <span>Phone:</span>
                <span className={resumeData.phone ? "valid" : "invalid"}>
                  {resumeData.phone || "Missing"} {resumeData.phone ? "✓" : "✗"}
                </span>
              </div>
              <div className="contact-item">
                <span>LinkedIn:</span>
                <span className={resumeData.linkedin && resumeData.linkedin.includes("linkedin.com") ? "valid" : "invalid"}>
                  {resumeData.linkedin || "Missing"} {resumeData.linkedin && resumeData.linkedin.includes("linkedin.com") ? "✓" : "✗"}
                </span>
              </div>
            </div>
            
            {/* Improvement Suggestions */}
            <div className="ats-suggestions">
              <h3>Improvement Suggestions</h3>
              <ul className="suggestions-list">
                {results.overallScore < 80 && (
                  <li>Your ATS score is below 80. Focus on improving keyword matching and skills alignment.</li>
                )}
                {results.keywordMatch.missingKeywords && results.keywordMatch.missingKeywords.length > 0 && (
                  <li>Add missing keywords naturally throughout your resume: {results.keywordMatch.missingKeywords.slice(0, 5).join(", ")}</li>
                )}
                {results.skillsMatch.missingSkills && results.skillsMatch.missingSkills.length > 0 && (
                  <li>Consider adding these skills: {results.skillsMatch.missingSkills.slice(0, 5).join(", ")}</li>
                )}
                {results.actionVerbs.verbCount < 5 && (
                  <li>Use more action verbs in your experience descriptions (e.g., "built", "optimized", "designed")</li>
                )}
                {results.actionVerbs.quantifiedCount < 3 && (
                  <li>Add quantified achievements with numbers, percentages, or dollar amounts</li>
                )}
                {results.structure.missingSections && results.structure.missingSections.length > 0 && (
                  <li>Add missing sections: {results.structure.missingSections.join(", ")}</li>
                )}
                {results.formatting.issues && results.formatting.issues.length > 0 && (
                  <li>Fix formatting issues: {results.formatting.issues.join(", ")}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
