import { IFollow } from "@/models/followModel";
import { fixtureIds } from "./userFixture";
import mongoose from "mongoose";

// Date de référence pour assurer la cohérence des timestamps
const now = new Date();

// Création des follows avec tous les champs requis
export const followFixtures = [
  {
    _id: new mongoose.Types.ObjectId(),
    follower_id: fixtureIds.kilianId,
    following_id: fixtureIds.adminId,
    follow_date: now,   
    created_at: now,
    updated_at: now,
    __v: 0
  },
  {
    _id: new mongoose.Types.ObjectId(),
    follower_id: fixtureIds.johnId,
    following_id: fixtureIds.kilianId,
    follow_date: now,
    created_at: now,
    updated_at: now,
    __v: 0
  },
  {
    _id: new mongoose.Types.ObjectId(),
    follower_id: fixtureIds.adminId,
    following_id: fixtureIds.kilianId,
    follow_date: now,
    created_at: now,
    updated_at: now,
    __v: 0
  }
]; 