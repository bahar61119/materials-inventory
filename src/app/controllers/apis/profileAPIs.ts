import { User } from '../../models/userModel';
import { ProfileService } from '../../services/profileService';

export function updateProfile(userData: any) {
    return ProfileService.updateProfile(User.from(userData));
}