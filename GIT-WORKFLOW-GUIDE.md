Git Workflow & Aturan Repository Maloka

Dokumen ini berisi panduan penggunaan Git dan GitHub dalam project Maloka.

Tujuan dari workflow ini adalah:

- Menjaga branch "main" tetap stabil.
- Memisahkan pekerjaan setiap anggota tim.
- Mengurangi risiko konflik kode.
- Memastikan setiap perubahan diperiksa sebelum masuk ke "main".
- Menjaga proses development tetap terstruktur dan terdokumentasi.

---

📌 Struktur Branch

Branch utama yang digunakan:

main
│
├── feature/frontend
├── feature/backend
├── feature/database
├── feature/uiux
├── feature/qa
└── chore

Jenis Branch

Branch| Kegunaan
"main"| Branch utama dan versi stabil project
"feature/..."| Pengembangan fitur atau pekerjaan tertentu
"fix/..."| Perbaikan bug atau error
"docs/..."| Perubahan dokumentasi
"chore"| Konfigurasi, maintenance, dan pekerjaan DevOps

«Catatan: Setiap anggota wajib bekerja pada branch masing-masing dan tidak melakukan coding langsung pada "main".»

---

🚀 1. Clone Repository

Setiap anggota melakukan clone repository ke komputer masing-masing.

git clone https://github.com/Danzkuduro-cl/maloka-project.git

Masuk ke folder project:

cd maloka-project

Cek branch yang tersedia:

git branch

Setelah melakukan clone, repository biasanya berada pada branch default yaitu:

main

«Jangan mulai coding sebelum berpindah ke branch tugas masing-masing.»

---

🌿 2. Pindah ke Branch Masing-Masing

Setiap anggota memiliki branch yang telah ditentukan sesuai tugas.

Contoh:

feature/frontend
feature/backend
feature/database
feature/uiux
feature/qa

Pindah ke branch masing-masing:

git switch feature/nama-branch

Contoh untuk anggota Backend:

git switch feature/backend

Kemudian cek branch aktif:

git branch

Contoh:

  main
* feature/backend

Tanda "*" menunjukkan branch yang sedang aktif.

«Setelah berada di branch masing-masing, seluruh proses coding dilakukan di branch tersebut.»

---

🔄 3. Sinkronisasi dengan "main"

Sebelum memulai pekerjaan baru, pastikan branch sudah mendapatkan perubahan terbaru dari "main".

Ambil informasi terbaru dari repository:

git fetch origin

Pastikan berada di branch sendiri:

git switch feature/nama-branch

Kemudian gabungkan perubahan terbaru dari "main":

git merge origin/main

Jika tidak terdapat konflik, branch sudah mendapatkan perubahan terbaru dari "main".

Kenapa harus dilakukan?

Misalnya:

7 Oktober
main
 ↓
Anggota clone repository
 ↓
Mulai coding

Kemudian Backend melakukan perubahan dan berhasil masuk ke "main" pada 8 Oktober.

Jika Frontend masih menggunakan versi lama, maka perubahan Backend tidak akan otomatis muncul di komputer Frontend.

Frontend harus melakukan sinkronisasi:

git fetch origin
git merge origin/main

Dengan begitu branch Frontend mendapatkan versi "main" terbaru.

«Sebelum memulai pekerjaan baru, biasakan melakukan sinkronisasi dengan "main".»

---

💻 4. Coding

Setelah berada pada branch masing-masing, anggota dapat mulai mengerjakan tugas.

Contoh pembagian:

feature/backend
→ Backend / API

feature/frontend
→ Tampilan dan fitur Frontend

feature/database
→ Database / Prisma

feature/uiux
→ UI/UX dan implementasi desain

feature/qa
→ Testing dan Quality Assurance

Selama proses development:

- Jangan coding di "main".
- Jangan mengubah pekerjaan anggota lain tanpa koordinasi.
- Fokus pada tugas yang diberikan.
- Hindari memasukkan perubahan yang tidak berkaitan dengan tugas.

---

🔍 5. Periksa Perubahan

Sebelum melakukan commit, periksa perubahan yang telah dibuat.

Cek status:

git status

Melihat detail perubahan:

git diff

Pastikan file yang berubah memang berkaitan dengan pekerjaan yang sedang dilakukan.

---

📦 6. Commit Perubahan

Masukkan perubahan ke staging:

git add .

Kemudian buat commit:

git commit -m "feat: deskripsi perubahan"

Contoh:

git commit -m "feat: add login page"

Format Commit

Gunakan prefix berikut:

Prefix| Penggunaan
"feat"| Menambahkan fitur baru
"fix"| Memperbaiki bug
"docs"| Mengubah dokumentasi
"chore"| Konfigurasi / maintenance
"refactor"| Perubahan struktur kode
"test"| Menambah atau memperbaiki testing

Contoh:

feat: add login page
fix: fix login validation
docs: update API documentation
chore: update project configuration
refactor: simplify authentication logic
test: add login test

«Commit message harus menjelaskan perubahan yang dilakukan secara singkat dan jelas.»

---

☁️ 7. Push ke Branch Masing-Masing

Setelah melakukan commit, kirim perubahan ke branch masing-masing di GitHub.

git push origin feature/nama-branch

Contoh:

git push origin feature/backend

⚠️ Penting

❌ Jangan push langsung ke main
✅ Push ke branch masing-masing

Perubahan tidak langsung masuk ke "main".

---

🔀 8. Pull Request

Setelah perubahan berhasil di-push, buat Pull Request (PR) dari branch masing-masing menuju "main".

Contoh:

feature/backend
       ↓
 Pull Request
       ↓
     main

Pull Request digunakan untuk meminta agar perubahan diperiksa sebelum digabungkan ke branch utama.

---

🧪 9. CI & Code Review

Setelah Pull Request dibuat, proses pemeriksaan dilakukan.

CI

CI (Continuous Integration) akan menjalankan pengecekan otomatis terhadap project.

Contoh pengecekan:

Install Dependencies
        ↓
      Lint
        ↓
      Build

Jika CI gagal:

❌ CI Failed

Perbaiki masalah pada branch masing-masing, kemudian:

git add .
git commit -m "fix: fix CI error"
git push origin feature/nama-branch

Pull Request akan otomatis diperbarui.

---

👀 Code Review

Pull Request kemudian diperiksa oleh anggota yang ditunjuk, terutama:

- DevOps / Team Lead
- Anggota yang berkaitan dengan fitur
- Reviewer lain jika diperlukan

Hal yang diperiksa:

- Apakah perubahan sesuai dengan tugas?
- Apakah terdapat error?
- Apakah terdapat conflict?
- Apakah CI berhasil?
- Apakah perubahan mengganggu fitur lain?

---

✅ 10. Approval & Merge

Jika perubahan sudah dianggap layak:

CI              ✅
Code Review     ✅
No Conflict     ✅
        ↓
     APPROVE
        ↓
      MERGE
        ↓
      main

Perubahan hanya boleh masuk ke "main" setelah mendapatkan persetujuan sesuai aturan project.

Alur Approval

Developer
    ↓
Push ke branch sendiri
    ↓
Pull Request
    ↓
CI
    ↓
Review
    ↓
DevOps / Team Lead Approval
    ↓
Merge
    ↓
main

---

🔄 11. Setelah Merge

Setelah Pull Request berhasil di-merge ke "main", perubahan tersebut sudah menjadi bagian dari project utama.

Sebelum memulai pekerjaan berikutnya, anggota harus menyinkronkan branch mereka dengan "main".

git switch feature/nama-branch
git fetch origin
git merge origin/main

Setelah branch mendapatkan perubahan terbaru, anggota dapat melanjutkan pekerjaan.

---

📋 Alur Lengkap

┌─────────────────────┐
│   Clone Repository  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│  Switch ke Branch   │
│     Masing-masing   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Sync dengan main  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│       Coding        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   git status/diff   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│       Commit        │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Push ke Branch      │
│     Masing-masing   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   Pull Request      │
│      → main         │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│     CI + Review     │
└──────────┬──────────┘
           ↓
     ┌─────┴─────┐
     │           │
   Gagal       Lulus
     │           │
     ↓           ↓
   Fix       Approval
     │           │
     └─────┐     ↓
           │   Merge
           │     ↓
           └──→ main
                 ↓
          Sync Branch
                 ↓
        Pekerjaan Berikutnya

---

⚠️ Aturan Utama

1. Dilarang melakukan coding langsung di "main".
2. Dilarang melakukan push langsung ke "main".
3. Setiap anggota wajib menggunakan branch masing-masing.
4. Setiap perubahan menuju "main" harus melalui Pull Request.
5. Pull Request harus melewati CI dan code review.
6. Sebelum memulai pekerjaan baru, branch harus disinkronkan dengan "main".
7. Gunakan commit message yang jelas dan sesuai format.
8. Jangan memasukkan perubahan yang tidak berkaitan dengan pekerjaan ke dalam commit.
9. Jika terjadi conflict, conflict harus diselesaikan sebelum merge.
10. "main" digunakan sebagai branch utama dan versi stabil project.
11. Perubahan yang sudah di-merge ke "main" menjadi acuan untuk pekerjaan berikutnya.
12. Jika terdapat perubahan besar atau berpotensi memengaruhi anggota lain, komunikasikan terlebih dahulu kepada tim.

---

👥 Tanggung Jawab

Developer

- Bekerja pada branch masing-masing.
- Melakukan commit secara teratur.
- Push perubahan ke branch sendiri.
- Membuat Pull Request.
- Memperbaiki masalah yang ditemukan saat CI atau review.

DevOps / Team Lead

- Mengatur workflow Git dan GitHub.
- Menjaga branch "main".
- Memastikan CI berjalan.
- Melakukan atau mengatur proses review.
- Memastikan Pull Request mengikuti aturan project.
- Mengawasi proses merge ke "main".

Seluruh Anggota

- Mengikuti aturan Git workflow.
- Tidak melakukan push langsung ke "main".
- Melakukan sinkronisasi sebelum memulai pekerjaan baru.
- Mengomunikasikan conflict atau masalah yang dapat memengaruhi anggota lain.

---

🎯 Prinsip Utama

«Branch untuk bekerja, Pull Request untuk memeriksa, "main" untuk versi stabil.»

Semua anggota bebas mengembangkan tugasnya pada branch masing-masing, tetapi perubahan yang masuk ke "main" harus melalui proses Pull Request → CI → Review → Approval → Merge.
