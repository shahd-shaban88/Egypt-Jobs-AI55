# Egypt Jobs AI

This is a simple and modern job board web application dedicated to AI and Machine Learning opportunities in Egypt. 

I built this project to make it easier for developers, data scientists, and AI enthusiasts to find relevant jobs, whether they are full-time roles, internships, or remote opportunities. 

**Client:** Ahmed Ibrahim Abdelrahman

## Overview

The platform uses a clean, mobile-first dark theme and doesn't rely on any heavy frontend frameworks—just plain HTML, CSS, and Vanilla JavaScript. The job data is currently fetched from a mock JSON file (`jobs.json`), which makes it very easy to plug in a real backend API later.

**Key Features:**
- Real-time search functionality that filters jobs as you type.
- Interactive sidebar filters for Job Type and Work Mode.
- Dynamic "Apply" buttons that route to the specific job application URLs.
- Fully responsive layout that looks great on desktop and mobile screens.

## How to download and run on your device

You don't need any complex build setup or `npm install` for this. Just follow these easy steps:

1. Download the code to your device (either by cloning the repository or downloading it as a ZIP file and extracting it).
2. Because the app uses the `fetch()` API to get the job data, opening `index.html` directly might not work. You need to run it through a local web server.
3. You can use any simple server, for example:
   - If you use VS Code: just install the "Live Server" extension, right-click `index.html` and choose **Open with Live Server**.
   - If you have Python installed: open your terminal in the project folder and run `python -m http.server 8000`.
   - If you have Node.js: run `npx http-server .`

## How to add a real API (LinkedIn & Job Boards)

Currently, the application loads job data from a local `jobs.json` file. To integrate real jobs from platforms like LinkedIn or other job boards, you can easily swap the data source:

1. **Find an API:** You need a backend API that gives you real job data. You can either build your own web scraper (e.g., using Python/BeautifulSoup) or use a ready-made service like RapidAPI (search for LinkedIn Jobs APIs).
2. **Update the fetch URL:** Open `script.js` and locate the `fetchJobs()` function.
3. Change the URL from `'jobs.json'` to your actual API endpoint:
   ```javascript
   const response = await fetch('https://your-api-endpoint.com/linkedin-jobs');
   ```
4. **Map the data:** Real APIs will have different property names (like `job_title` instead of `title`). Inside the `fetchJobs` function, just map the incoming API response to match the structure this app expects:
   ```javascript
   allJobs = data.map(apiJob => ({
       id: apiJob.job_id,
       title: apiJob.job_title,
       company: apiJob.company_name,
       logo: apiJob.company_logo_url,
       type: apiJob.employment_type,
       mode: apiJob.workplace_type,
       location: apiJob.location,
       description: apiJob.description,
       datePosted: apiJob.posted_date,
       applyLink: apiJob.apply_url
   }));
   ```

## Deployment

The project is configured to be easily hosted on GitHub Pages. In fact, a GitHub Action is already set up in the `.github/workflows` folder to automatically publish the `main` branch to GitHub Pages whenever new code is pushed.

---
*Designed and developed by Shahd Shaban.*
