<template>
  <q-page>
    <div class="q-pa-md">
      <!--separator-->
      <div class="row q-col-gutter-lg">
        <div class="col">
          <q-toolbar class="text-primary">
            <q-toolbar-title class="text-text-body2">
              List of Candidates</q-toolbar-title
            >
            <q-btn
              dense
              color="white"
              text-color="primary"
              icon-right="touch_app"
              to="/V_Vote"
            >
              <q-tooltip :offset="[0, 8]">Click to vote</q-tooltip>
            </q-btn>
          </q-toolbar>
        </div>
      </div>
      <!--separator-->

      <div class="row">
        <div v-for="rep in collegeCandidates" :key="rep.candidate_id">
          <div class="col-12 col-md q-pa-sm">
            <q-card class="my-card cursor-pointer">
              <div class="q-pa-sm">
                <div class="row">
                  <div class="col-4 q-gutter-sm">
                    <div class="text-center">
                      <q-avatar size="93px">
                        <q-img
                          square
                          v-if="rep.student?.url"
                          :src="`http://localhost:3000/media/${rep.student?.url}`"
                        />
                        <q-img
                          v-if="!rep.student?.url"
                          src="~assets/images/MSU.jpg"
                          class="q-pb-sm"
                        />
                      </q-avatar>
                    </div>
                  </div>
                  <div class="col-8 q-pa-sm">
                    <div class="text-subtitle1 text-bold">
                      {{ rep.student?.first_name }}
                      {{ rep.student?.middle_name }}
                      {{ rep.student?.last_name }}
                    </div>
                    <div class="text-caption">
                      <strong>{{ rep.student?.college }}</strong>
                    </div>
                    <div class="text-caption">
                      {{ rep.student?.course }}
                    </div>
                    <div class="text-caption">
                      {{ rep.student?.yr_admitted }}
                    </div>
                  </div>
                </div>
                <q-separator />
                <div class="row">
                  <div class="col">
                    <q-card-section class="text-italic">
                      "{{ rep.platform }}"
                    </q-card-section>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-------------------------->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="amber-13" text-color="white" />
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
import { CandidateDto, StudentDto, ElectionDto } from 'src/services/rest-api';
import { Vue, Options } from 'vue-class-component';
import { mapActions, mapState } from 'vuex';
import { ICandidateVote } from 'src/store/vote-rep/state';
import { AUser } from 'src/store/auth/state';

@Options({
  computed: {
    ...mapState('candidate', ['allCandidate']),
    ...mapState('student', ['allStudent']),
    ...mapState('election', ['allElection']),
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    ...mapActions('candidate', [
      'addCandidate',
      'editCandidate',
      'deleteCandidate',
      'getAllCandidate',
    ]),
  },
})
export default class ManageElection extends Vue {
  addCandidate!: (payload: CandidateDto) => Promise<void>;
  editCandidate!: (payload: CandidateDto) => Promise<void>;
  deleteCandidate!: (payload: CandidateDto) => Promise<void>;
  getAllCandidate!: () => Promise<void>;
  allCandidate!: CandidateDto[];
  allElection!: ElectionDto[];

  getAllStudent!: () => Promise<void>;
  allStudent!: StudentDto[];
  currentUser!: AUser;

  async mounted() {
    await this.getAllCandidate();
  }

  get collegeName() {
    return this.currentUser?.student.college || '';
  }
  get collegeCandidates() {
    return this.allCandidate.filter(
      (c) => c.student?.college == this.collegeName
    );
  }

  filter = '';
  showDetails = false;
  addNewCandidate = false;
  editRowCandidate = false;
  dense = true;

  student_type = ['Regular', 'Representative'];
  fitModes = ['scale-down'];
}
</script>

<style>
.bg-img {
  background-color: #f3eee8;
}
.q-carousel {
  background-color: #f3eee8;
}
.my-card {
  height: 300px;
  max-height: 100%;
  width: 300px;
}
.my-sticky-table {
  width: 250px;
}
</style>
