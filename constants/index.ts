export const navigationLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/library",
    label: "Library",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
};

export const sampleBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    rating: 4.5,
    totalCopies: 10,
    availableCopies: 5,
    description:
      "A novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself in 'The Midnight Library', a library between life and death where she can live out different versions of her life.",
    coverColor: "#1c1f40",
    coverUrl: "https://m.media-amazon.com/images/I/81J6APjwxlL.jpg",
    videoUrl: "/sample-video.mp4",
    summary:
      "A dazzling novel about all the choices that go into a life well lived, The Midnight Library tells the story of Nora Seed as she finds herself in 'The Midnight Library', a library between life and death where she can live out different versions of her life.",
    createdAt: null,
  },
  {
    id: "2",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Fiction",
    rating: 4.6,
    totalCopies: 8,
    availableCopies: 3,
    description:
      "A reclusive Hollywood icon finally tells her story to a young journalist, revealing the secrets behind her glamorous and mysterious life.",
    coverColor: "#d4a574",
    coverUrl: "https://m.media-amazon.com/images/I/81drfTT9ZSL.jpg",
    videoUrl: "/sample-video.mp4",
    summary:
      "A reclusive Hollywood icon finally tells her story to a young journalist, revealing the secrets behind her glamorous and mysterious life.",
    createdAt: null,
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    rating: 4.4,
    totalCopies: 12,
    availableCopies: 7,
    description:
      "An Easy & Proven Way to Build Good Habits & Break Bad Ones. This book provides practical strategies for forming good habits and breaking bad ones.",
    coverColor: "#2d5a27",
    coverUrl: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
    videoUrl: "/sample-video.mp4",
    summary:
      "An Easy & Proven Way to Build Good Habits & Break Bad Ones. This book provides practical strategies for forming good habits and breaking bad ones.",
    createdAt: null,
  },
  {
    id: "4",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    genre: "Self-Help",
    rating: 4.2,
    totalCopies: 15,
    availableCopies: 10,
    description:
      "A counterintuitive approach to living a good life by embracing our limitations and focusing on what truly matters.",
    coverColor: "#1a1a1a",
    coverUrl: "https://m.media-amazon.com/images/I/71QKQ9mwV7L.jpg",
    videoUrl: "/sample-video.mp4",
    summary:
      "A counterintuitive approach to living a good life by embracing our limitations and focusing on what truly matters.",
    createdAt: null,
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir",
    rating: 4.7,
    totalCopies: 9,
    availableCopies: 4,
    description:
      "A memoir about a woman who grows up in a survivalist family and eventually seeks out an education from the world beyond.",
    coverColor: "#8b5a3c",
    coverUrl: "https://m.media-amazon.com/images/I/81NwOj14S3L.jpg",
    videoUrl: "/sample-video.mp4",
    summary:
      "A memoir about a woman who grows up in a survivalist family and eventually seeks out an education from the world beyond.",
    createdAt: null,
  },
];

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Title A-Z", value: "title-asc" },
  { label: "Title Z-A", value: "title-desc" },
  { label: "Author A-Z", value: "author-asc" },
  { label: "Author Z-A", value: "author-desc" },
];

export const DEFAULT_LOGIN_REDIRECT = "/";