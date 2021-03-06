import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { IAuthState } from './state';
import { ssgApiService } from 'src/services/ssg-api.service';

const actions: ActionTree<IAuthState, StateInterface> = {
  async login(context, payload: { userName: string; password: string }) {
      await ssgApiService.loginUser(payload);
      await context.dispatch('authUser');
  },
  async authUser(context) {
    try {
      const user = await ssgApiService.getProfile();
      context.commit('setCurrentUser', user.data);
      return user;
    } catch (error) {
      // work around
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      return error;
    }
  },
};

export default actions;
