import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  // Hapus import ManyToOne, JoinColumn, Genre
  
  @Entity('category') // <-- Ubah nama tabel
  export class Category { // <-- Ubah nama class
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    user_id: number;
  
    @Column()
    jenis: string; // <-- Ubah title menjadi jenis
  
    @Column()
    deskripsi: string; // <-- Ubah director menjadi deskripsi
  
    // Hapus genre_id
    // Hapus relasi genre
    // Hapus image_url
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }