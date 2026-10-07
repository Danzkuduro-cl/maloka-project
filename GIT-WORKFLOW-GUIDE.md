Git Workflow & Aturan Penggunaan Repository Maloka

Dokumen ini berisi aturan dan alur kerja penggunaan Git dan GitHub dalam project Maloka. Tujuannya agar setiap anggota dapat bekerja secara terpisah tanpa mengganggu branch "main", serta menjaga project tetap terorganisir.

---

1. Clone Repository

Setiap anggota melakukan clone repository ke komputer masing-masing.

git clone https://github.com/Danzkuduro-cl/maloka-project.git

Masuk ke folder project:

cd maloka-project

Cek branch yang tersedia:

git branch

«Jangan langsung melakukan coding di branch "main".»

---

2. Gunakan Branch Sesuai Tugas

Setiap anggota bekerja pada branch yang telah ditentukan.

Contoh:

feature/frontend
feature/backend
feature/database
feature/uiux
feature/qa

Pindah ke branch masing-masing:

git switch feature/nama-branch

Contoh:

git switch feature/backend

Pastikan branch yang aktif sudah benar:

git branch

Branch yang aktif ditandai dengan "*".

Contoh:

* feature/backend
  main

---

3. Sebelum Mulai Coding, Sinkronkan dengan "main"

Sebelum mulai pekerjaan baru, anggota wajib memastikan branch-nya sudah mendapatkan perubahan terbaru dari "main".

Pertama, ambil informasi terbaru dari repository:

git fetch origin

Kemudian pastikan berada di branch pekerjaan sendiri:

git switch feature/nama-branch

Gabungkan perubahan terbaru dari "main":

git merge origin/main

Jika tidak ada konflik, branch sudah mendapatkan perubahan terbaru dari "main".

«Tujuan langkah ini adalah agar pekerjaan yang dilakukan berdasarkan versi project terbaru dan mengurangi kemungkinan konflik saat Pull Request.»

---

4. Lakukan Pekerjaan / Coding

Kerjakan tugas sesuai pembagian masing-masing.

Contoh:

feature/backend
→ mengerjakan API / Backend

feature/frontend
→ mengerjakan tampilan dan fitur Frontend

feature/database
→ mengerjakan database / Prisma

feature/uiux
→ mengerjakan desain dan kebutuhan UI/UX

feature/qa
→ mengerjakan testing dan perbaikan terkait QA

Selama proses coding, jangan berpindah atau melakukan coding langsung di "main".

---

5. Periksa Perubahan Sebelum Commit

Setelah selesai melakukan perubahan, cek file yang berubah:

git status

Untuk melihat detail perubahan:

git diff

Pastikan hanya perubahan yang berkaitan dengan pekerjaan yang sedang dilakukan.

---

6. Commit Perubahan

Masukkan perubahan ke staging:

git add .

Kemudian buat commit:

git commit -m "feat: deskripsi perubahan"

Contoh:

git commit -m "feat: add login page"

Contoh format commit:

feat: fitur baru
fix: memperbaiki bug
docs: perubahan dokumentasi
chore: perubahan konfigurasi / maintenance
refactor: perubahan struktur kode tanpa mengubah fungsi
test: menambahkan atau memperbaiki testing

Commit message harus menggambarkan perubahan yang dilakukan.

---

7. Push ke Branch Masing-Masing

Setelah commit selesai, push perubahan ke branch sendiri.

git push origin feature/nama-branch

Contoh:

git push origin feature/backend

«DILARANG melakukan push langsung ke "main".»

Perubahan harus dikirim terlebih dahulu ke branch masing-masing.

---

8. Buat Pull Request

Setelah perubahan berhasil di-push ke GitHub:

Branch masing-masing
        ↓
   Pull Request
        ↓
      main

Buat Pull Request dari branch pekerjaan menuju:

main

Contoh:

feature/backend → main

Pull Request digunakan untuk meminta agar perubahan yang telah dibuat dapat diperiksa sebelum digabungkan ke "main".

---

9. Proses Review

Setelah Pull Request dibuat:

1. CI akan menjalankan pengecekan otomatis.
2. Anggota terkait dapat melakukan review.
3. DevOps / Team Lead melakukan pemeriksaan.
4. Pastikan tidak ada konflik.
5. Pastikan CI berhasil.
6. Pastikan perubahan sesuai dengan tugas.

Jika masih terdapat kesalahan, lakukan perbaikan pada branch yang sama lalu push kembali.

git add .
git commit -m "fix: fix review feedback"
git push origin feature/nama-branch

Pull Request akan otomatis diperbarui.

---

10. Approval dan Merge

Jika perubahan sudah dinyatakan layak:

CI ✅
Review ✅
Tidak ada conflict ✅
        ↓
    APPROVE
        ↓
      MERGE
        ↓
      main

Perubahan hanya boleh masuk ke "main" setelah mendapatkan persetujuan sesuai aturan project.

---

11. Setelah Pull Request Di-merge

Setelah perubahan berhasil masuk ke "main", anggota harus memperbarui branch lokalnya sebelum memulai pekerjaan berikutnya.

git switch feature/nama-branch
git fetch origin
git merge origin/main

Dengan demikian branch masing-masing tetap mengikuti perkembangan terbaru project.

---

Alur Singkat

Secara keseluruhan, workflow yang digunakan adalah:

1. Clone Repository
       ↓
2. Masuk ke Branch Masing-Masing
       ↓
3. Sync dengan main
       ↓
4. Coding
       ↓
5. git status / git diff
       ↓
6. git add
       ↓
7. git commit
       ↓
8. git push ke branch sendiri
       ↓
9. Pull Request → main
       ↓
10. CI + Review
       ↓
11. Approval
       ↓
12. Merge → main
       ↓
13. Sync branch dengan main
       ↓
14. Mulai pekerjaan berikutnya

Aturan Utama

1. Dilarang coding langsung di "main".
2. Dilarang push langsung ke "main".
3. Setiap anggota wajib menggunakan branch masing-masing.
4. Setiap perubahan menuju "main" harus melalui Pull Request.
5. Pull Request harus melewati proses CI dan review.
6. Sebelum memulai pekerjaan baru, branch wajib disinkronkan dengan "main".
7. Commit message harus menjelaskan perubahan yang dilakukan.
8. Jangan memasukkan perubahan yang tidak berhubungan dengan tugas ke dalam commit.
9. Jika terdapat konflik saat proses merge, selesaikan konflik terlebih dahulu sebelum melanjutkan merge.
10. "main" digunakan sebagai branch utama/stabil project.
