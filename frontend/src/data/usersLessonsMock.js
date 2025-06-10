// src/data/userLessonsMock.js

export const userLessonsMock = [
  // Mariana (id 1) no Taco (aula 1)
  { id: 1, userId: 1, aulaId: 1, lessonId: 101, status: "completed" },
  { id: 2, userId: 1, aulaId: 1, lessonId: 102, status: "pending" },
  { id: 3, userId: 1, aulaId: 1, lessonId: 103, status: "pending" },

  // João (id 2) no Risotto (aula 2)
  { id: 4, userId: 2, aulaId: 2, lessonId: 201, status: "completed" },
  { id: 5, userId: 2, aulaId: 2, lessonId: 202, status: "completed" },
  { id: 6, userId: 2, aulaId: 2, lessonId: 203, status: "pending" },

  // Camila (id 3) no Sushi (aula 3)
  { id: 7, userId: 3, aulaId: 3, lessonId: 301, status: "pending" },
  { id: 8, userId: 3, aulaId: 3, lessonId: 302, status: "pending" },

  // Lucas (id 4) no Pad Thai (aula 4)
  { id: 9, userId: 4, aulaId: 4, lessonId: 401, status: "completed" },
  { id: 10, userId: 4, aulaId: 4, lessonId: 402, status: "completed" },
  { id: 11, userId: 4, aulaId: 4, lessonId: 403, status: "completed" },
];
