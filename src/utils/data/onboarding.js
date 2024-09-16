import Image from 'next/image';

export const dataOnboard = [
  {
    url: 'app-dashboard-step-1',
    image: '/image/action-1.webp',
    title: 'Explore Dashboards',
    description:
      'Disjointed data costs you time and clouds your judgment. Let’s face it, you can’t afford to stay on this hamster wheel any longer. Just automate when you can.',
  },
  {
    url: 'data-manage-access-step-1',
    image: '/image/action-3.webp',
    title: 'Data management',
    description:
      'Fix what is failing, polish what is rising. A single source of truth for marketing, product, and customer success to understand their impact',
  },
  {
    url: 'track-app-search-step-1',
    image: '/image/action-2.webp',
    title: 'Track the application',
    description:
      'A complete picture of how your apps & competitors are performing. Understand where the gaps are between you and your growth targets. Truth, not guesswork.',
  },
];

export const dataOverview = [
  {
    image: '/image/overview-1.webp',
  },
  {
    image: '/image/overview-2.webp',
  },
  {
    image: '/image/overview-3.webp',
  },
];

export const dataTracking = [
  {
    search: (
      <div className="flex items-center">
        Click <Image src="/image/icon-search.webp" alt="" style={{ margin: '0 3px' }} width={25} height={25} /> icon on
        menu bar.
      </div>
    ),
    addApp: `Click "Add your app" button.`,
    addKeyword: `In the keyword table, click the "Add" button.`,
    addCompare: `Click "Add competitor" on tab bar.`,
    dataManage: 'Click profile icon on top right.',
  },
  {
    search: 'Enter the name or keywords related to the application.',
    addApp: 'You can get data from google analytics and partner.',
    addKeyword: 'Enter the keywords you want to track.',
    addCompare: 'Search the competitor app you want to track.',
    dataManage: `Click "CMS" on dropdown.`,
  },
  {
    search: 'Click on the application you are interested in.',
    addApp: `Click "Follow" button to receive notifications about changes .`,
    addKeyword: 'Supply keyword competitiveness.',
    dataManage: 'Comprehensive data management',
    addCompare: 'Click application icon to show information.',
  },
];

export const dataDashboard = [
  {
    app: `Click "Apps" on menu bar`,
    developer: `Click "Developers" on menu bar.`,
    review: `Click number of reviews on landing page.`,
  },
  {
    app: 'Select date range to view data for that time period.',
    developer: 'Select date range to view data for that time period.',
    review: 'Select date range to view data for that time period.',
  },
  {
    app: 'Click on a component of the chart to view details.',
    developer: `Click on a component of the chart to view details.`,
    review: 'Click on a component of the chart to view details.',
  },
];
