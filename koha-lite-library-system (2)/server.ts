import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const BOOKS_FILE = path.join(process.cwd(), "books.json");

  // Helper to read books
  const getBooks = async () => {
    const data = await fs.readFile(BOOKS_FILE, "utf-8");
    return JSON.parse(data);
  };

  // Helper to save books
  const saveBooks = async (books: any[]) => {
    await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
  };

  // API Routes
  app.get("/api/books", async (req, res) => {
    try {
      const books = await getBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const books = await getBooks();
      const newBook = { ...req.body, id: Date.now().toString() };
      books.push(newBook);
      await saveBooks(books);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: "Failed to add book" });
    }
  });

  app.put("/api/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let books = await getBooks();
      const index = books.findIndex((b: any) => b.id === id);
      if (index === -1) return res.status(404).json({ error: "Book not found" });
      
      books[index] = { ...books[index], ...req.body };
      await saveBooks(books);
      res.json(books[index]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      let books = await getBooks();
      books = books.filter((b: any) => b.id !== id);
      await saveBooks(books);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete book" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
