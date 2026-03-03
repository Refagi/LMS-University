import httpStatusCode from 'http-status-codes';
import prisma from '../../prisma/client.js';
import { ApiError } from '@/utils/ApiError.js';
import { Prisma, Role } from '@/generated/prisma/client.js';
import { config } from '@/config/config.js';
import type { UpdateUserEmailType } from '@/models/user.model.js';
import { AuthServices, AdminUserServices } from './index';
import { TokenTypes } from '@/models/token.model.js';

type User = Prisma.UserGetPayload<{}>;
type Token = Prisma.TokenGetPayload<{}>;

class UserService {
    static async updateUserEmail (userBody: UpdateUserEmailType) {
        const { userId, newEmail } = userBody;
        const getUser = await AdminUserServices.getUserById(userId);
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
                Profile: {
                    select: {
                        fullName: true,
                        phone: true,
                        placeOfBirth: true,
                        dateOfBirth: true,
                        npm: true,
                        nidn: true,
                        image: true,
                        StudyProgram: {
                            select: {
                                name: true,
                                Faculty: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        generation: true
                    }
                }
            }
        })
        if(!getUser) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Pengguna tidak ditemukan!');
        }
        if(!getUser.Profile) {
            throw new ApiError(httpStatusCode.NOT_FOUND, 'Profil pengguna tidak ditemukan!');
        }
          const baseProfile = {
            id: getUser.id,
            email: getUser.email,
            role: getUser.role,
            fullName: getUser.Profile.fullName,
            phone: getUser.Profile.phone,
            placeOfBirth: getUser.Profile.placeOfBirth,
            dateOfBirth: getUser.Profile.dateOfBirth,
            image: getUser.Profile.image,
            StudyProgram: getUser.Profile.StudyProgram,
        }
        if (getUser.role === 'MAHASISWA') {
            return {
                ...baseProfile,
                npm: getUser.Profile.npm,
                generation: getUser.Profile.generation
            }
        }
        if (getUser.role === 'DOSEN') {
            return {
                ...baseProfile,
                nidn: getUser.Profile.nidn
            }
        }
        return baseProfile
    }
  
};

export default UserService;