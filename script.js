// DOM Elements
const jobsContainer = document.getElementById('jobsContainer');
const searchInput = document.getElementById('searchInput');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const jobCardTemplate = document.getElementById('jobCardTemplate');

// Mobile specific elements
const mobileFilterBtn = document.getElementById('mobileFilterBtn');
const closeFiltersBtn = document.getElementById('closeFiltersBtn');
const filtersSidebar = document.querySelector('.filters-sidebar');

// State
let allJobs = [];
let filteredJobs = [];
let activeFilters = {
    type: [],
    mode: []
};
let currentSort = 'newest';
let searchQuery = '';

// Initialize application
async function init() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Fetch Data
    await fetchJobs();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Initial Render
    applyFiltersAndSort();
}

// Fetch dummy data from local JSON
async function fetchJobs() {
    try {
        const response = await fetch('jobs.json');
        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        allJobs = data.jobs;
    } catch (error) {
        console.error('Error fetching data:', error);
        jobsContainer.innerHTML = '<div class="error-msg">Failed to load jobs. Please try again later.</div>';
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Search input (Real-time filtering)
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFiltersAndSort();
    });

    // Filter checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filterCategory = e.target.getAttribute('data-filter');
            const value = e.target.value;
            
            if (e.target.checked) {
                activeFilters[filterCategory].push(value);
            } else {
                activeFilters[filterCategory] = activeFilters[filterCategory].filter(item => item !== value);
            }
            
            applyFiltersAndSort();
        });
    });

    // Sort select
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });

    // Clear filters button
    clearFiltersBtn.addEventListener('click', clearAllFilters);

    // Mobile Filters Toggle
    if (mobileFilterBtn && closeFiltersBtn) {
        mobileFilterBtn.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeFiltersBtn.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Core filtering and sorting logic
function applyFiltersAndSort() {
    // 1. Filter by Search Query
    filteredJobs = allJobs.filter(job => {
        if (!searchQuery) return true;
        return job.title.toLowerCase().includes(searchQuery) ||
               job.company.toLowerCase().includes(searchQuery) ||
               job.description.toLowerCase().includes(searchQuery);
    });

    // 2. Filter by Job Type
    if (activeFilters.type.length > 0) {
        filteredJobs = filteredJobs.filter(job => activeFilters.type.includes(job.type));
    }

    // 3. Filter by Work Mode
    if (activeFilters.mode.length > 0) {
        filteredJobs = filteredJobs.filter(job => activeFilters.mode.includes(job.mode));
    }

    // 4. Sort
    filteredJobs.sort((a, b) => {
        const dateA = new Date(a.datePosted).getTime();
        const dateB = new Date(b.datePosted).getTime();
        
        if (currentSort === 'newest') {
            return dateB - dateA; // Descending
        } else {
            return dateA - dateB; // Ascending
        }
    });

    // Render resulting jobs
    renderJobs();
}

// Render jobs to DOM
function renderJobs() {
    // Clear container
    jobsContainer.innerHTML = '';
    
    // Update count
    resultsCount.textContent = `${filteredJobs.length} Job${filteredJobs.length !== 1 ? 's' : ''} Found`;

    if (filteredJobs.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        
        // Render cards
        filteredJobs.forEach(job => {
            const jobElement = createJobCard(job);
            jobsContainer.appendChild(jobElement);
        });
    }
}

// Create a single job card element using template
function createJobCard(job) {
    const template = jobCardTemplate.content.cloneNode(true);
    
    const card = template.querySelector('.job-card');
    
    template.querySelector('.company-logo').src = job.logo;
    template.querySelector('.company-logo').alt = `${job.company} logo`;
    template.querySelector('.job-title').textContent = job.title;
    template.querySelector('.company-name').textContent = job.company;
    template.querySelector('.job-description').textContent = job.description;
    
    template.querySelector('.type-tag').textContent = job.type;
    template.querySelector('.mode-tag').textContent = job.mode;
    template.querySelector('.loc-text').textContent = job.location;
    
    template.querySelector('.post-date').textContent = formatTimeAgo(job.datePosted);
    template.querySelector('.apply-btn').href = job.applyLink;

    // Optional: add animation delay for staggered entrance
    return template;
}

// Utility: Clear all filters
function clearAllFilters() {
    searchInput.value = '';
    searchQuery = '';
    
    activeFilters = { type: [], mode: [] };
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    applyFiltersAndSort();
}

// Utility: Format date to "X days ago"
function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    return `${diffMonths} months ago`;
}

// Start app
document.addEventListener('DOMContentLoaded', init);
