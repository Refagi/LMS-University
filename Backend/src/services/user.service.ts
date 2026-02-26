import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma, Role } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { UpdateUserEmailType } from '@/models/user.model.js';
import { AuthServices, AdminServices } from './index';
import { TokenTypes } from '@/models/token.model.js';

type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

class UserService {
    static async updateUserEmail (userBody: UpdateUserEmailType) {
        const { userId, newEmail } = userBody;
        const getUser = await AdminServices.getUserById(userId);
        if(!getUser) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
        }

        const [updateUser] = await prisma.$transaction([
            prisma.user.update({
                where: {id: getUser.id},
                data: {email: newEmail, updatedAt: new Date()}
            }),
            prisma.token.deleteMany({
                where: {userId: getUser.id, type: TokenTypes.UPDATE_EMAIL},

            })
        ])
        return updateUser;
    }

    static async getProfileUser (userId: string) {
        const getUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                profile: {
                    select: {
                        fullName: true,
                        phone: true,
                        placeOfBirth: true,
                        dateOfBirth: true,
                        npm: true,
                        nidn: true,
                        image: true,
                        faculty: true,
                        StudyProgram: true,
                        generation: true
                    }
                }
            }
        })
        if(!getUser) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
        }
        if(!getUser.profile) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Profil pengguna tidak ditemukan!');
        }
          const baseProfile = {
            id: getUser.id,
            email: getUser.email,
            role: getUser.role,
            fullName: getUser.profile.fullName,
            phone: getUser.profile.phone,
            placeOfBirth: getUser.profile.placeOfBirth,
            dateOfBirth: getUser.profile.dateOfBirth,
            image: getUser.profile.image,
            faculty: getUser.profile.faculty,
            StudyProgram: getUser.profile.StudyProgram,
        }
        if (getUser.role === 'MAHASISWA') {
            return {
                ...baseProfile,
                npm: getUser.profile.npm,
                generation: getUser.profile.generation
            }
        }
        if (getUser.role === 'DOSEN') {
            return {
                ...baseProfile,
                nidn: getUser.profile.nidn
            }
        }
        return baseProfile
    }
  
};

export default UserService;