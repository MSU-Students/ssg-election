import { IRepresentativeVote } from './../vote-ssg/state';
import { SsgMember } from 'src/interfaces/ssg-member.interface';
import ssgmemberservice from 'src/services/ssg-member.service';
import { SsgMemberDto } from 'src/services/rest-api';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SsgMemberStateInterface } from './state';

const actions: ActionTree<SsgMemberStateInterface, StateInterface> = {
  async addProclaimSsgMember(context, payload: any): Promise<void> {
    payload.map(async (i: any) => {
      const newPayload = {
        student: i.representative.student?.student_id,
        user: i.representative.user?.account_id,
        position: i.representative.position,
        academic_yr: i.representative.election?.academic_yr,
      };
      const result = await ssgmemberservice.create(newPayload);
      context.commit('setNewSsgMember', result);
      await context.dispatch('getAllSsgMember');
    });
  },

  async proclaimAllOfficers(context, payload: IRepresentativeVote[]) {
    payload.map(async (c) => {
      const check = c.representative?.user;
      await context.dispatch(
        'student/appointStudent',
        c.representative.student?.student_id,
        { root: true }
      );
      if (c.representative?.position === 'Prime Minister') {
        await this.dispatch('account/editAccount', {
          ...check,
          userType: 'ssg',
        });
      }
      if (c.representative?.position === 'Executive Secretary') {
        await this.dispatch('account/editAccount', {
          ...check,
          userType: 'ssg',
        });
      }
    });
  },

  async addSsgMember(context, payload: any): Promise<void> {
    const result = await ssgmemberservice.create(payload);
    context.commit('setNewSsgMember', result);
    await context.dispatch('getAllSsgMember');
    // await this.dispatch('student/editStudent', {
    //   ...payload.student,
    //   student_type: 'Representative',
    // });
  },

  async editSsgMember(context, payload: any): Promise<any> {
    const result = await ssgmemberservice.update(payload.ssgmember_id, payload);
    context.commit('updateSsgMember', result);
    await context.dispatch('getAllSsgMember');
  },

  async deleteSsgMember(context, ssgmember_id: number): Promise<any> {
    const result = await ssgmemberservice.delete(ssgmember_id);
    context.commit('deleteSsgMember', result);
    await context.dispatch('getAllSsgMember');
  },

  async getAllSsgMember(context): Promise<any> {
    const res = await ssgmemberservice.getAll();
    context.commit('getAllSsgMember', res);
  },

  async updateStatus(context) {
    const check = context.state.allSsgMember.map(async (s) => {
      if (s.position === 'Prime Minister') {
        await context.dispatch('');
      }
    });
  },

  async getOneSsgMember(context, ssgmember_id: number): Promise<any> {
    const res = await ssgmemberservice.getOne(ssgmember_id);
    context.commit('getOneSsgMember', res);
  },
};

export default actions;
