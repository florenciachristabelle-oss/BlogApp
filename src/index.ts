import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { db } from './db/db'; 
import { postsTable, categoriesTable } from './db/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categoriesTable);
    res.json({ status: true, data: allCategories });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kategori', error: (error as Error).message });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }
    await db.insert(categoriesTable).values({ name });
    res.status(201).json({ message: 'Kategori berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kategori', error: (error as Error).message });
  }
});

app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const allPosts = await db.select().from(postsTable);
    res.json({ status: true, data: allPosts });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data artikel', error: (error as Error).message });
  }
});


app.get('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const post = await db.select().from(postsTable).where(eq(postsTable.id, id));
    if (post.length === 0) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }
    res.json({ status: true, data: post[0] });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil detail artikel', error: (error as Error).message });
  }
});


app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const { title, content, categoryId, imageUrl } = req.body;
    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Title, content, dan categoryId wajib diisi' });
    }
    await db.insert(postsTable).values({ 
      title, 
      content,
      categoryId,
      imageUrl: imageUrl || null
    });
    res.status(201).json({ message: 'Artikel berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat artikel', error: (error as Error).message });
  }
});


app.put('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content, categoryId, imageUrl } = req.body;
    await db.update(postsTable)
      .set({ title, content, categoryId, imageUrl })
      .where(eq(postsTable.id, id));
    res.json({ message: 'Artikel berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui artikel', error: (error as Error).message });
  }
});


app.delete('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(postsTable).where(eq(postsTable.id, id));
    res.json({ message: 'Artikel berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus artikel', error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});