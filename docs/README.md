# Documentation Guidelines

Folder `docs/` digunakan untuk menyimpan dokumentasi dan hasil pekerjaan dari masing-masing role dalam pengembangan website **Maloka**.

## Folder Structure

Setiap dokumentasi disimpan pada folder sesuai dengan role masing-masing:

```text
docs/
├── UI-UX/
├── Database/
├── Backend/
├── Frontend/
├── QA/
└── DevOps/
```

## File Naming Convention

Gunakan format penamaan file:

```text
lowercase-with-dash
```

Gunakan huruf kecil dan tanda hubung (`-`) sebagai pemisah antar kata.

### Contoh

```text
database-design.md
api-documentation.md
test-plan.md
deployment-guide.md
frontend-structure.md
```

### Hindari

```text
DatabaseDesign.md
Database Design.md
database_design.md
FINAL-DATABASE.md
database-final-fix-v2.md
```

## File Format

Dokumentasi berbasis teks menggunakan format:

```text
.md
```

Untuk file yang membutuhkan format atau media lain, seperti desain UI/UX, gunakan format yang sesuai dan letakkan pada folder role masing-masing.

## Role Documentation

| Role               | Folder             |
| ------------------ | ------------------ |
| UI/UX Designer     | `docs/UI-UX/`      |
| DBA                | `docs/Database/`   |
| Backend Developer  | `docs/Backend/`    |
| Frontend Developer | `docs/Frontend/`   |
| QA Engineer        | `docs/QA/`         |
| DevOps             | `docs/DevOps/` |

## Documentation Rules

1. Simpan dokumentasi pada folder sesuai dengan role masing-masing.
2. Gunakan format penamaan file yang telah ditentukan.
3. Hindari penggunaan nama file yang ambigu atau tidak menjelaskan isi dokumentasi.
4. Satu file digunakan untuk satu topik atau jenis dokumentasi yang jelas.
5. Dokumentasi dapat diperbarui selama proses pengembangan project.
6. Isi dan struktur teknis dokumentasi dapat disesuaikan dengan kebutuhan masing-masing role.
7. Jika membuat dokumentasi baru, pastikan nama dan lokasi file tetap mengikuti aturan yang telah ditentukan.

## Note

Aturan ini dibuat untuk menjaga struktur repository tetap rapi, konsisten, dan mudah dipahami oleh seluruh anggota tim.

**Format dan isi dokumentasi dapat dikembangkan sesuai kebutuhan project selama tidak mengubah struktur folder dan aturan penamaan yang telah disepakati.**

