const content = {
  "profile": {
    "name": "Nour Ali",
    "fullName": "Nour El-Deen Ali",
    "role": "Software Engineer at Amazon Ads",
    "location": "Seattle, WA",
    "photo": "images/HeadShot.jpeg",
    "headline": "I make backend systems **faster** and **easier to use**.",
    "intro": "I'm a software engineer at Amazon Ads and a master's student in Computer Science at Georgia Tech. I graduate in May 2027.",
    "resumeUrl": "https://1drv.ms/b/c/0c291ba0de7013eb/IQDrE3DeoBspIIAM3EYAAAAAAQKHsjxMtIGHw_pGW2zTZnI?e=wBg8cE",
    "email": "alinour6446@gmail.com",
    "github": "https://github.com/alinour64",
    "linkedin": "https://www.linkedin.com/in/alinour64",
    "formAction": "https://formspree.io/f/mjvlyjnp"
  },
  "sections": {
    "about": {
      "title": "About",
      "intro": ""
    },
    "experience": {
      "title": "Experience",
      "intro": "Where I've worked so far."
    },
    "projects": {
      "title": "Projects",
      "intro": "Things I built to learn something new."
    },
    "education": {
      "title": "Education",
      "intro": ""
    },
    "volunteer": {
      "title": "Volunteer",
      "intro": "Work I do for my community."
    },
    "skills": {
      "title": "Toolbox",
      "intro": "Languages and tools I've used at work and in my projects."
    },
    "contact": {
      "title": "Let's talk.",
      "intro": "Email is the fastest way to reach me. You can also send a message with the form."
    }
  },
  "about": [
    "I'm a software engineer at **Amazon Ads** in Seattle. Before Amazon I was on the AIDA ML Engineering Governance team at **American Express**. There I sped up Elasticsearch indexing and built the Spring Boot and React tool that sits on top of it.",
    "I studied Computer Science and Software Engineering at the University of Washington and graduated in December 2024. Now I'm doing my master's at **Georgia Tech** while I work. I chose the AI specialization because I want to build intelligent systems that have a real impact.",
    "Outside of work I've helped run Tamkeen Youth since 2016. We hold weekly events, and I mentor students who are thinking about STEM degrees."
  ],
  "skills": [
    {
      "label": "Languages",
      "items": [
        "Java",
        "Python",
        "JavaScript",
        "C#",
        "C++",
        "SQL"
      ]
    },
    {
      "label": "Backend",
      "items": [
        "Spring Boot",
        "ASP.NET Core",
        "Node.js",
        "REST APIs",
        "SignalR"
      ]
    },
    {
      "label": "Search and data",
      "items": [
        "Elasticsearch",
        "PostgreSQL",
        "Azure SQL",
        "pandas",
        "NumPy"
      ]
    },
    {
      "label": "Machine learning",
      "items": [
        "TensorFlow",
        "Keras",
        "scikit-learn",
        "Plotly"
      ]
    },
    {
      "label": "Frontend",
      "items": [
        "React",
        "HTML",
        "CSS"
      ]
    },
    {
      "label": "Cloud and tools",
      "items": [
        "AWS",
        "Azure",
        "Docker",
        "Git",
        "Unity"
      ]
    }
  ],
  "experience": [
    {
      "logo": "images/logos/amazon.svg",
      "logoFill": false,
      "org": "Amazon",
      "role": "Software Development Engineer",
      "start": "Apr 2025",
      "end": "Present",
      "location": "Seattle, WA",
      "note": "Amazon Ads",
      "summary": "I build and maintain software for Amazon Ads.",
      "bullets": [],
      "tags": []
    },
    {
      "logo": "images/logos/amex.svg",
      "logoFill": true,
      "org": "American Express",
      "role": "Software Engineer",
      "start": "Jun 2024",
      "end": "Apr 2025",
      "location": "Phoenix, AZ",
      "note": "Full time Jan to Apr 2025 · Intern Jun to Aug 2024",
      "summary": "I worked on the AIDA ML Engineering Governance team, which builds the systems that keep machine learning models compliant.",
      "bullets": [
        "Sped up data indexing by streamlining backend retrieval and tuning Elasticsearch queries.",
        "Added similarity algorithms to Elasticsearch to make search results more accurate.",
        "Designed indexing pipelines that keep search data accurate in real time.",
        "Built a full-stack interface in Spring Boot and React that made the system easier to use."
      ],
      "tags": [
        "Java",
        "Spring Boot",
        "Elasticsearch",
        "React"
      ]
    },
    {
      "logo": "images/logos/uw.svg",
      "logoFill": false,
      "org": "University of Washington",
      "role": "CS Teaching Assistant",
      "start": "Jan 2024",
      "end": "Apr 2024",
      "location": "Seattle, WA",
      "note": "",
      "summary": "",
      "bullets": [
        "Graded assignments and exams for more than 100 students and wrote feedback they could act on.",
        "Ran weekly office hours and tutoring sessions."
      ],
      "tags": []
    },
    {
      "logo": "images/logos/uri.svg",
      "logoFill": false,
      "org": "University of Rhode Island",
      "role": "Geospatial Research",
      "start": "Nov 2022",
      "end": "Feb 2023",
      "location": "Kingston, RI",
      "note": "Stealth mode project",
      "summary": "",
      "bullets": [
        "Cut map load times by 30% by integrating and tuning the Google Maps, OpenStreetMap and GraphHopper APIs.",
        "Improved the accuracy and clarity of geospatial data in a real-time web app.",
        "Built a responsive React interface that made navigation simpler."
      ],
      "tags": [
        "React",
        "Google Maps",
        "OSM",
        "GraphHopper"
      ]
    }
  ],
  "projects": [
    {
      "title": "Real-Time Messaging Platform",
      "category": "Web",
      "color": "blue",
      "summary": "A chat app where messages and typing indicators reach every connected user instantly. It runs on a React frontend and an ASP.NET Core backend hosted on Azure.",
      "highlights": [
        "Built a SignalR hub that broadcasts messages to every client and sends typing notifications to everyone except the person typing.",
        "Added ASP.NET Core Identity for sign up and login, with JWTs checked on every protected endpoint.",
        "Stored users and messages in Azure SQL and deployed the app to Azure Web App."
      ],
      "stack": [
        "React",
        "C# / .NET",
        "SignalR",
        "Azure"
      ],
      "links": [
        {
          "label": "Code",
          "url": "https://github.com/alinour64/Real-Time-Chat-Application"
        },
        {
          "label": "Demo video",
          "url": "https://www.youtube.com/watch?v=VNCBEUTO41s"
        }
      ],
      "image": "images/projects/real-time-messaging-platform.jpg"
    },
    {
      "title": "ML Stock Predictor",
      "category": "Machine learning",
      "color": "mint",
      "summary": "A stacked LSTM that forecasts closing prices from the previous 100 trading days. It runs in a Streamlit app with interactive charts for moving averages, RSI and Bollinger Bands.",
      "highlights": [
        "Built pipelines that fetch, clean and scale historical prices from Yahoo Finance, with an 80/20 train and test split.",
        "Trained the model in TensorFlow and plotted its predictions against real prices with Plotly.",
        "Deployed the app on Streamlit so anyone can try it from a link."
      ],
      "stack": [
        "TensorFlow",
        "Python",
        "Plotly",
        "Streamlit"
      ],
      "links": [
        {
          "label": "Code",
          "url": "https://github.com/alinour64/StockPredictionModel"
        },
        {
          "label": "Live app",
          "url": "https://stockspredictionmodel.streamlit.app/"
        }
      ],
      "image": "images/projects/ml-stock-predictor.png"
    },
    {
      "title": "File System for ThreadOS",
      "category": "Systems",
      "color": "coral",
      "summary": "A Unix-like file system for the ThreadOS teaching kernel, written in Java. It has a superblock, inodes, a directory, a shared file table and the system calls that tie them together.",
      "highlights": [
        "Implemented file I/O, file descriptors and the system calls on top of them.",
        "Gave each open file its own lock so the file system stays safe under concurrent threads.",
        "Built inode management and a single-level directory, then tested them to make sure no data was lost."
      ],
      "stack": [
        "Java",
        "OS internals",
        "Concurrency"
      ],
      "links": [
        {
          "label": "Code and report",
          "url": "https://github.com/alinour64/ThreadOS-File-System"
        }
      ],
      "image": "images/projects/file-system-for-threados.png"
    },
    {
      "title": "ARM Microcontroller Kernel",
      "category": "Systems",
      "color": "violet",
      "summary": "A small kernel for an ARM microcontroller, written in assembly. I led a team of three and focused on system startup and memory management.",
      "highlights": [
        "Wrote the service call routines and timer management.",
        "Built dynamic heap allocation from scratch.",
        "Tested and documented each part so the code stayed easy to maintain."
      ],
      "stack": [
        "ARM Assembly",
        "Embedded"
      ],
      "links": [
        {
          "label": "Code",
          "url": "https://github.com/alinour64/AssemblyFinalProject"
        }
      ],
      "image": "images/projects/arm-microcontroller-kernel.png"
    },
    {
      "title": "Launcher Hijinx",
      "category": "Games",
      "color": "pink",
      "summary": "A 2D multiplayer platformer built in Unity by a three-person Scrum team. It runs in the browser, and more than 100 students played it.",
      "highlights": [
        "Reworked the respawn mechanics so players spend less time waiting.",
        "Worked on core gameplay and the end-game flow so a round wraps up cleanly."
      ],
      "stack": [
        "Unity",
        "C#",
        "WebGL"
      ],
      "links": [
        {
          "label": "Play it",
          "url": "https://alinour64.github.io/385FinalGame/FinalGame/WEBGL/"
        },
        {
          "label": "Trailer",
          "url": "https://youtu.be/uxr4AhwCXcw"
        }
      ],
      "image": "images/projects/launcher-hijinx.jpg"
    }
  ],
  "education": [
    {
      "logo": "images/logos/gatech.svg",
      "logoFill": false,
      "school": "Georgia Institute of Technology",
      "degree": "MS Computer Science · Artificial Intelligence",
      "start": "",
      "end": "May 2027",
      "note": "In progress",
      "links": []
    },
    {
      "logo": "images/logos/uw.svg",
      "logoFill": false,
      "school": "University of Washington",
      "degree": "BS Computer Science and Software Engineering",
      "start": "",
      "end": "Dec 2024",
      "note": "GPA 3.6 · CeDiD 25Z1-NX0U-NQI5 · name starts with NO",
      "links": [
        {
          "label": "Verify degree",
          "url": "https://apps.registrar.washington.edu/cecredential/verify/"
        }
      ]
    },
    {
      "logo": "images/logos/bellevue.svg",
      "logoFill": false,
      "school": "Bellevue College",
      "degree": "Running Start",
      "start": "",
      "end": "Jun 2021",
      "note": "GPA 3.98",
      "links": []
    }
  ],
  "volunteer": [
    {
      "logo": "",
      "logoFill": false,
      "org": "Tamkeen Youth",
      "role": "Director of Activities",
      "start": "2016",
      "end": "Present",
      "location": "",
      "note": "",
      "summary": "I organize weekly events for more than 500 young people and mentor them toward STEM degrees.",
      "bullets": [],
      "tags": []
    },
    {
      "logo": "images/logos/kumon.svg",
      "logoFill": true,
      "org": "Kumon",
      "role": "Math and English Tutor",
      "start": "2017",
      "end": "2020",
      "location": "",
      "note": "",
      "summary": "I taught students aged 3 to 11 and adjusted my approach to how each one learned.",
      "bullets": [],
      "tags": []
    }
  ]
};
