<template>
  <q-page>
    <div class="q-pl-md">
      <div class="text-h5 q-pa-sm q-pt-md text-bold">
        <q-icon name="list" color="primary" style="font-size: 3rem" />
        Candidate List
      </div>
    </div>
    <!-----------Recent Election Ballot-------------->
    <div class="row q-pt-md q-pa-sm">
      <q-table
        class="my-sticky-header-table"
        title="List of Candidates for College Representative"
        :grid="$q.screen.xs"
        :columns="CandidateColumn"
        :rows="allCandidate"
        row-key="name"
        :rows-per-page-options="[0]"
        :filter="filter"
      >
        <template v-slot:top-right>
          <div class="q-gutter-sm row">
            <q-input
              outlined
              rounded
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <div>
              <q-btn
                color="primary"
                dense
                flat
                icon="add"
                @click="addNewCandidate = true"
              />
              <q-tooltip :offset="[0, 8]">Add Account</q-tooltip>
            </div>
            <q-dialog v-model="addNewCandidate" persistent>
              <q-card style="width: 900px; max-width: 100vw">
                <q-card-section class="row">
                  <q-toolbar>
                    <div class="text-h6">Add New Candidate</div>
                    <q-space />
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      color="primary"
                      @click="resetModelCandidate()"
                      v-close-popup
                    />
                  </q-toolbar>
                </q-card-section>

                <q-card-section class="q-gutter-sm">
                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="options"
                        option-label="school_id"
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        use-input
                        @filter="filterFn"
                        @update:model-value="onSelectStudent($event)"
                        label="Select ID Number"
                      >
                      </q-select>
                    </div>
                    <!-- foreign key -->
                    <!-- <div class="col">
                      <q-input
                        dense
                        outlined
                        disable
                        readonly
                        v-model="inputCandidate.user"
                        label="User ID"
                      />
                    </div> -->
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="first_name"
                        readonly
                        disable
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        label="First Name (Read Only)"
                      />
                    </div>
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="last_name"
                        readonly
                        disable
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        label="Last Name (Read Only)"
                      >
                      </q-select>
                    </div>
                  </div>

                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="academic_yr"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.election"
                        dense
                        outlined
                        label="Academic Year"
                      >
                      </q-select>
                    </div>
                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="election_type"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.election"
                        dense
                        outlined
                        label="Election Type"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '']"
                      >
                      </q-select>
                    </div>
                  </div>
                  <div class="q-gutter-xs">
                    <q-input
                      v-model="inputCandidate.platform"
                      type="textarea"
                      dense
                      outlined
                      label="Platform"
                    >
                    </q-input>
                  </div>
                  <div align="right">
                    <q-btn
                      flat
                      label="Cancel"
                      color="red-10"
                      @click="resetModelCandidate()"
                      v-close-popup
                    />
                    <q-btn
                      flat
                      label="Save"
                      color="primary"
                      type="submit"
                      @click="onaddCandidateAccount()"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm" v-if="inputCandidate">
              <q-btn
                round
                color="warning"
                icon="edit"
                size="sm"
                flat
                dense
                @click="openEditCandidateDialog(props.row)"
                ><q-tooltip class="bg-warning text-black" :offset="[10, 10]">
                  Edit
                </q-tooltip></q-btn
              >

              <!---------EDIT CANDIDATE----------->
              <q-dialog v-model="editRowCandidate" persistent>
                <q-card style="width: 800px; max-width: 100vw">
                  <q-card-section class="row">
                    <div class="text-h6">Edit Account</div>
                    <q-space />
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      color="primary"
                      v-close-popup
                    />
                  </q-card-section>

                  <q-card-section class="q-gutter-sm">
                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="options"
                        option-label="school_id"
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        use-input
                        @filter="filterFn"
                        @update:model-value="onSelectStudent($event)"
                        label="Select ID Number"
                      >
                      </q-select>
                    </div>
                    <!-- foreign key -->
                    <!-- <div class="col">
                      <q-input
                        dense
                        outlined
                        readonly
                        v-model="inputCandidate.user"
                        label="User ID"
                      />
                    </div> -->
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="first_name"
                        readonly
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        label="First Name (Read Only)"
                      />
                    </div>
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="last_name"
                        readonly
                        option-value="student_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.student"
                        dense
                        outlined
                        label="Last Name (Read Only)"
                      >
                      </q-select>
                    </div>
                  </div>

                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="academic_yr"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.election"
                        dense
                        outlined
                        label="Academic Year"
                      >
                      </q-select>
                    </div>
                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="election_type"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputCandidate.election"
                        dense
                        outlined
                        label="Election Type"
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '']"
                      >
                      </q-select>
                    </div>
                  </div>
                  <div class="q-gutter-xs">
                    <q-input
                      v-model="inputCandidate.platform"
                      type="textarea"
                      dense
                      outlined
                      label="Platform"
                    >
                    </q-input>
                  </div>
                  <div align="right">
                    <q-btn
                      flat
                      label="Cancel"
                      color="red-10"
                      @click="resetModelCandidate()"
                      v-close-popup
                    />
                    <q-btn
                      flat
                      label="Save"
                      color="primary"
                      type="submit"
                      @click="onEditCandidateAccount()"
                    />
                  </div>
                </q-card-section>
                </q-card>
              </q-dialog>
              <q-btn
                color="red-10"
                icon="delete"
                size="sm"
                class="q-ml-sm"
                flat
                round
                dense
                @click="deleteSpecificCandidateAccount(props.row)"
                ><q-tooltip class="bg-red-10" :offset="[10, 10]">
                  Delete
                </q-tooltip></q-btn
              >
              <q-btn
                round
                color="primary"
                icon="more_vert"
                size="md"
                flat
                dense
                @click="openDetailDialog(props.row)"
                ><q-tooltip class="bg-primary" :offset="[10, 10]">
                  Details
                </q-tooltip></q-btn
              >
              <q-dialog v-model="showDetails">
                <q-card
                  class="my-card q-pa-md"
                  style="width: 600px; max-width: 60vw"
                  flat
                  bordered
                >
                  <q-card-section>
                    <div class="text-h6">
                      Candidate Information
                      <q-btn
                        round
                        flat
                        dense
                        icon="close"
                        class="float-right"
                        color="primary"
                        v-close-popup
                      ></q-btn>
                    </div>
                  </q-card-section>
                  <q-card-section horizontal>
                    <q-card-section class="q-pt-xs col">
                      <div class="text-h5 q-mb-xs text-bold">
                        {{ inputCandidate.student?.first_name }}
                        {{ inputCandidate.student?.middle_name }}
                        {{ inputCandidate.student?.last_name }}
                      </div>

                      <div class="text-overline">
                        {{ inputCandidate.student?.college }}
                      </div>
                      <div class="text-caption">
                        {{ inputCandidate.student?.course }}
                      </div>
                      <div class="text-caption text-grey">
                        Running for:
                        <strong>{{ inputCandidate.position_type }}</strong>
                      </div>
                    </q-card-section>

                    <q-card-section class="col-4 flex flex-center">
                      <q-img
                        square
                        v-if="inputCandidate.student?.url"
                        :src="`http://localhost:3000/media/${inputCandidate.student?.url}`"
                      /><q-img
                        v-if="!inputCandidate.student?.url"
                        src="~assets/images/MSU.jpg"
                      />
                    </q-card-section>
                  </q-card-section>

                  <q-separator />

                  <q-card-section>
                    <div class="text-italic text-h5">
                      "{{ inputCandidate.platform }}"
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <!----------------------------------------------->
  </q-page>
</template>

<script lang="ts">
import {
  CandidateDto,
  StudentDto,
  ElectionDto,
  UserDto,
} from 'src/services/rest-api';
import { Vue, Options } from 'vue-class-component';
import { mapActions, mapState } from 'vuex';

@Options({
  computed: {
    ...mapState('candidate', ['allCandidate']),
    ...mapState('student', ['allStudent']),
    ...mapState('election', ['allElection']),
    ...mapState('account', ['allAccount']),
  },
  methods: {
    ...mapActions('candidate', [
      'addCandidate',
      'editCandidate',
      'deleteCandidate',
      'getAllCandidate',
    ]),
    ...mapActions('account', ['getAllUser']),
  },
})
export default class ManageCandidate extends Vue {
  addCandidate!: (payload: CandidateDto) => Promise<void>;
  editCandidate!: (payload: CandidateDto) => Promise<void>;
  deleteCandidate!: (payload: CandidateDto) => Promise<void>;
  getAllCandidate!: () => Promise<void>;
  allCandidate!: CandidateDto[];
  allElection!: ElectionDto[];
  allAccount!: UserDto[];
  getAllUser!: () => Promise<void>;

  getAllStudent!: () => Promise<void>;
  allStudent!: StudentDto[];
  options: UserDto[] = [];

  async mounted() {
    await this.getAllCandidate();
    await this.getAllUser();
    this.options = this.allAccount;
  }

  CandidateColumn = [
    { name: 'action', align: 'center', label: '', field: 'action' },
    {
      name: 'id',
      align: 'center',
      label: 'ID Number',
      field: (row: any) => row.student?.school_id,
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (row: any) =>
        row.student?.last_name +
        ', ' +
        row.student?.first_name +
        ' ' +
        row.student?.middle_name,
      sortable: true,
    },
    {
      name: 'email',
      align: 'center',
      label: 'Email',
      field: (row: any) => row.student?.email,
      sortable: true,
    },
    {
      name: 'level',
      align: 'center',
      label: 'Year Admitted',
      field: (row: any) => row.student?.yr_admitted,
      sortable: true,
    },
    {
      name: 'course',
      align: 'center',
      label: 'Course',
      field: (row: any) => row.student?.course,
      sortable: true,
    },
    {
      name: 'college',
      align: 'center',
      label: 'College',
      field: (row: any) => row.student?.college,
      sortable: true,
    },
    {
      name: 'election_yr',
      align: 'center',
      label: 'Election Date',
      field: (row: any) => row.election?.end_date,
      sortable: true,
    },
  ];
  filter = '';
  showDetails = false;
  addNewCandidate = false;
  editRowCandidate = false;
  dense = true;

  student_type = ['Regular', 'Representative'];
  fitModes = ['scale-down'];
  inputCandidate: any = {
    position_type: 'Representative',
    platform: '',
  };

  onSelectStudent(user?: string) {
    this.inputCandidate.user = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.account_id;
  }

  async onaddCandidateAccount() {
    await this.addCandidate(this.inputCandidate);
    this.addNewCandidate = false;
    this.resetModelCandidate();
    this.$q.notify({
      type: 'positive',
      message: 'Account is successfully added.',
    });
  }

  async onEditCandidateAccount() {
    await this.editCandidate(this.inputCandidate);
    this.editRowCandidate = false;
    this.resetModelCandidate();
    this.$q.notify({
      type: 'positive',
      message: 'Successfully edited.',
    });
  }

  openEditCandidateDialog(val: CandidateDto) {
    this.editRowCandidate = true;
    this.inputCandidate = { ...val };
  }
  openDetailDialog(val: CandidateDto) {
    this.showDetails = true;
    this.inputCandidate = { ...val };
  }

  deleteSpecificCandidateAccount(val: CandidateDto) {
    this.$q
      .dialog({
        message: 'Are you sure you want to delete?',
        cancel: true,
        persistent: true,
      })
      .onOk(async () => {
        await this.deleteCandidate(val.candidate_id as any);
        this.$q.notify({
          type: 'warning',
          message: 'Successfully deleted.',
        });
      });
  }

  resetModelCandidate() {
    this.inputCandidate = {
      position_type: 'Representative',
      platform: '',
    };
  }

  filterFn(val: any, update: any) {
    if (val === '') {
      update(() => {
        this.options = this.allAccount.map(
          (i) => i.student
        ) as unknown as UserDto[];
      });
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      this.options = this.allAccount
        .filter(
          (v) => String(v.student?.school_id).toLowerCase().indexOf(needle) > -1
        )
        .map((i) => i.student) as unknown as UserDto[];
    });
  }
}
</script>

<style>
.my-sticky-header-table {
  height: 100%;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
}

.thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: white;
}

.thead tr th {
  position: sticky;
  z-index: 1;
}

.thead tr:first-child th {
  top: 0;
}

/* this is when the loading indicator appears */
.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}
</style>
