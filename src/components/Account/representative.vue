<template>
  <div>
    <q-table
      class="my-sticky-header-table"
      title="Representative Account List"
      :grid="$q.screen.xs"
      :columns="RepresentativeColumn"
      :rows="allRepresentative"
      row-key="name"
      :rows-per-page-options="[0]"
      :filter="filter"
    >
      <template v-slot:top-right>
        <div class="q-pa-md q-gutter-sm row">
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
            >
              <q-tooltip :offset="[0, 8]">Add Representative</q-tooltip>
            </q-btn>
          </div>
          <div>
            <q-btn
              color="primary"
              dense
              flat
              icon="verified"
              :disable="allCollegeRepresentative.length < 0"
              @click="onProclaimAllCanditates()"
            >
              <q-tooltip :offset="[0, 8]">Proclaim Candidates</q-tooltip>
            </q-btn>
          </div>
          <q-dialog v-model="addNewCandidate" persistent>
            <q-card style="width: 900px; max-width: 100vw">
              <q-card-section class="row">
                <q-toolbar>
                  <div class="text-h6">Add New Representative</div>
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
                      v-model="inputRepresentative.student"
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
                      v-model="inputRepresentative.user"
                      label="User ID"
                    />
                  </div> -->
                  <div class="col">
                    <q-select
                      :options="allStudent"
                      option-label="first_name"
                      disable
                      readonly
                      option-value="student_id"
                      map-options
                      emit-value
                      dense
                      outlined
                      v-model="inputRepresentative.student"
                      label="First Name (Disable and Read Only)"
                    >
                    </q-select>
                  </div>
                  <div class="col">
                    <q-select
                      :options="allStudent"
                      option-label="last_name"
                      disable
                      readonly
                      option-value="student_id"
                      map-options
                      emit-value
                      v-model="inputRepresentative.student"
                      dense
                      outlined
                      label="Last Name (Disable and Read Only)"
                    >
                    </q-select>
                  </div>
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
                    @click="onaddCandidateAccount()"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
          <div>
            <q-btn
              color="primary"
              dense
              flat
              icon="file_download"
              @click="exportTable()"
            >
              <q-tooltip :offset="[0, 8]">Export</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
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
                  <div class="text-h6">Edit Representative Candidacy</div>
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
                  <div class="q-pl-md text-overline text-grey">
                    Representative Information
                  </div>
                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="school_id"
                        option-value="student_id"
                        disable
                        readonly
                        map-options
                        emit-value
                        v-model="inputRepresentative.student"
                        dense
                        outlined
                      >
                      </q-select>
                    </div>
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="first_name"
                        option-value="student_id"
                        disable
                        readonly
                        map-options
                        emit-value
                        v-model="inputRepresentative.student"
                        dense
                        outlined
                      >
                      </q-select>
                    </div>
                    <div class="col">
                      <q-select
                        :options="allStudent"
                        option-label="last_name"
                        option-value="student_id"
                        disable
                        readonly
                        map-options
                        emit-value
                        v-model="inputRepresentative.student"
                        dense
                        outlined
                      >
                      </q-select>
                    </div>
                  </div>
                  <div class="q-pl-md text-overline text-grey">
                    Election Registration
                  </div>
                  <div class="row q-gutter-xs">
                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="academic_yr"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputRepresentative.election"
                        dense
                        outlined
                        label="Select Year Elected"
                      />
                    </div>

                    <div class="col">
                      <q-select
                        :options="allElection"
                        option-label="election_type"
                        option-value="election_id"
                        map-options
                        emit-value
                        v-model="inputRepresentative.election"
                        dense
                        outlined
                        label="Election Type (Disable and Read only)"
                      >
                      </q-select>
                    </div>
                  </div>
                  <div class="q-gutter-xs">
                    <q-select
                      outlined
                      dense
                      :options="position"
                      v-model="inputRepresentative.position"
                      label="Running for: "
                    />
                  </div>
                  <div class="q-gutter-xs">
                    <q-input
                      v-model="inputRepresentative.platform"
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
                      {{ inputRepresentative.student?.first_name }}
                      {{ inputRepresentative.student?.middle_name }}
                      {{ inputRepresentative.student?.last_name }}
                    </div>

                    <div class="text-overline">
                      {{ inputRepresentative.student?.college }}
                    </div>
                    <div class="text-caption">
                      {{ inputRepresentative.student?.course }}
                    </div>
                    <div class="text-caption text-grey">
                      Running for:
                      <strong>{{ inputRepresentative.position }}</strong>
                    </div>
                  </q-card-section>

                  <q-card-section class="col-4 flex flex-center">
                    <q-img
                      square
                      v-if="inputRepresentative.student?.url"
                      :src="`http://localhost:3000/media/${inputRepresentative.student?.url}`"
                    /><q-img
                      v-if="!inputRepresentative.student?.url"
                      src="~assets/images/MSU.jpg"
                    />
                  </q-card-section>
                </q-card-section>

                <q-separator />

                <q-card-section>
                  <div class="text-italic text-h5">
                    "{{ inputRepresentative.platform }}"
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </q-td>
      </template>
      <template #body-cell-position="props">
        <q-td :props="props">
          <q-chip
            flat
            color="white"
            :text-color="colorManipulation(props.row.position)"
            :label="labelManipulation(props.row.position)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {
  ElectionDto,
  StudentDto,
  RepresentativeDto,
  VoteRepDto,
  UserDto,
} from 'src/services/rest-api';
import { exportFile } from 'quasar';
import { ICandidateVote } from 'src/store/vote-rep/state';
import { Vue, Options } from 'vue-class-component';
import { mapActions, mapGetters, mapState, Payload } from 'vuex';

function wrapCsvValue(
  val: string,
  formatFn?: (v: string, r: any) => string,
  row?: any
) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);
  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')
  return `"${formatted}"`;
}

@Options({
  computed: {
    ...mapState('student', ['allStudent']),
    ...mapState('election', ['allElection']),
    ...mapState('representative', ['allRepresentative']),
    ...mapGetters('voteRep', ['collegeRepresentatives']),
    ...mapState('voteRep', ['summary']),
    ...mapState('account', ['allAccount']),
    ...mapState('election', ['activeElection']),
  },
  methods: {
    ...mapActions('voteRep', ['getAllVoteRep']),
    ...mapActions('student', ['editStudent']),
    ...mapActions('account', ['getAllUser']),
    ...mapActions('representative', [
      'addRepresentative',
      'addProclaimRepresentative',
      'editRepresentative',
      'deleteRepresentative',
      'getAllRepresentative',
      'proclaimAllCanditates',
    ]),
    ...mapActions('election', ['getActiveElection']),
  },
})
export default class ManageRepresentative extends Vue {
  //--------------------------------------------------------Table Column for student account
  allStudent!: StudentDto[];
  allElection!: ElectionDto[];
  getAllElection!: () => Promise<void>;
  getAllVoteRep!: () => Promise<void>;
  proclaimAllCanditates!: (payload: ICandidateVote[]) => Promise<void>;
  editStudent!: (payload: StudentDto) => Promise<void>;

  collegeRepresentatives!: ICandidateVote[];
  summary!: ICandidateVote[];

  allRepresentative!: RepresentativeDto[];
  addRepresentative!: (payload: any) => Promise<void>;
  addProclaimRepresentative!: (payload: any) => Promise<void>;
  editRepresentative!: (payload: RepresentativeDto) => Promise<void>;
  deleteRepresentative!: (payload: RepresentativeDto) => Promise<void>;
  getAllRepresentative!: () => Promise<void>;

  allAccount!: UserDto[];
  getAllUser!: () => Promise<void>;
  options: UserDto[] = [];

  getActiveElection!: () => Promise<void>;
  activeElection!: ElectionDto;

  async mounted() {
    await this.getAllRepresentative();
    await this.getAllVoteRep();
    await this.getAllUser();
    this.options = this.allAccount;
  }
  //-----------------------------------------------Table Column for candidate account
  RepresentativeColumn = [
    { name: 'action', align: 'center', label: '', field: 'action' },
    {
      name: 'id',
      align: 'left',
      label: 'ID Number',
      field: (row: RepresentativeDto) => row.student?.school_id,
      sortable: true,
    },
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: (row: RepresentativeDto) =>
        row.student?.last_name +
        ', ' +
        row.student?.first_name +
        ' ' +
        row.student?.middle_name,
      sortable: true,
    },
    {
      name: 'year_ad',
      align: 'center',
      label: 'Year Admitted',
      field: (row: RepresentativeDto) => row.student?.yr_admitted,
      sortable: true,
    },
    {
      name: 'course',
      align: 'center',
      label: 'Course',
      field: (row: RepresentativeDto) => row.student?.course,
      sortable: true,
    },
    {
      name: 'college',
      align: 'center',
      label: 'College',
      field: (row: RepresentativeDto) => row.student?.college,
      sortable: true,
    },
    {
      name: 'status',
      align: 'center',
      label: 'Student Status',
      field: (row: RepresentativeDto) => row.college_status,
      sortable: true,
    },
    {
      name: 'position',
      align: 'center',
      label: 'Position Candidacy',
      field: (row: RepresentativeDto) => row.position,
      sortable: true,
    },
  ];

  filter = '';
  imageAttachement: File[] | File = [];
  loading = false;
  showDetails = false;
  showSSGDetails = false;
  //candidate
  addNewCandidate = false;
  editRowCandidate = false;
  updateCandidate = false;

  inputRepresentative: any = {
    platform: '',
    position: 'No candidacy filed',
    college_status: 'College President',
  };

  //---------------------------------------------------for Candidate

  position = ['Prime Minister', 'Executive Secretary'];
  isLoading = true;

  get allCollegeRepresentative() {
    return this.collegeRepresentatives.filter((i) => !!i.votes.length);
  }

  onSelectStudent(user?: string) {
    this.inputRepresentative.user = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.account_id;

    this.inputRepresentative.first_name = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.student?.first_name;

    this.inputRepresentative.middle_name = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.student?.middle_name;

    this.inputRepresentative.last_name = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.student?.last_name;

    this.inputRepresentative.school_id = this.allAccount.find(
      (i) => i.student?.student_id === user
    )?.student?.school_id;
  }

  async onProclaimAllCanditates() {
    this.isLoading = true;
    this.$q
      .dialog({
        title: 'Do you want to proclaim the final candidates?',
        message:
          'Make sure that the Election for College Representative is over',
        color: 'negative',
        cancel: true,
        persistent: true,
      })
      .onOk(async () => {
        if (this.activeElection) {
          this.$q.dialog({
            title: 'Election Ongoing',
            message: 'You can only proclaim after the election ended',
            persistent: true,
          });
        } else {
          await this.proclaimAllCanditates(this.allCollegeRepresentative);
          await this.addProclaimRepresentative(this.allCollegeRepresentative);
          this.isLoading = false;
          this.$q.notify({
            type: 'positive',
            message: 'Candidates has been proclaimed!.',
          });
        }
      });
  }

  async onaddCandidateAccount() {
    await this.addRepresentative(this.inputRepresentative);
    this.addNewCandidate = false;
    this.resetModelCandidate();
    this.$q.notify({
      type: 'positive',
      message: 'Account is Successfully Added!.',
    });
  }

  async onEditCandidateAccount() {
    await this.editRepresentative(this.inputRepresentative);
    this.editRowCandidate = false;
    this.resetModelCandidate();
    this.$q.notify({
      type: 'positive',
      message: 'Successfully Edit.',
    });
  }

  openEditCandidateDialog(val: RepresentativeDto) {
    this.editRowCandidate = true;
    this.inputRepresentative = { ...val };
  }
  openDetailDialog(val: RepresentativeDto) {
    this.showDetails = true;
    this.inputRepresentative = { ...val };
  }

  deleteSpecificCandidateAccount(val: RepresentativeDto) {
    this.$q
      .dialog({
        message: 'Confirm to delete?',
        cancel: true,
        persistent: true,
      })
      .onOk(async () => {
        await this.deleteRepresentative(val.representative_id as any);
        this.$q.notify({
          type: 'warning',
          message: 'Successfully deleted',
        });
      });
  }

  resetModelCandidate() {
    this.inputRepresentative = {
      platform: '',
      position: 'No candidacy filed',
      voter_status: 'Not voted yet',
    };
  }

  //filtering
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

  colorManipulation(position: string) {
    if (position === 'No candidacy filed') {
      return 'grey';
    }
    if (position === 'Prime Minister') {
      return 'warning';
    }
    if (position === 'Executive Secretary') {
      return 'warning';
    }
  }
  labelManipulation(position: string) {
    if (position === 'No candidacy filed') {
      return 'No candidacy filed';
    }
    if (position === 'Prime Minister') {
      return 'Prime Minister';
    }
    if (position === 'Executive Secretary') {
      return 'Executive Secretary';
    }
  }

  //---------------Export Table
  exportTable() {
    // naive encoding to csv format
    const header = [
      wrapCsvValue('Student ID'),
      wrapCsvValue('First Name'),
      wrapCsvValue('Middle Name'),
      wrapCsvValue('Last Name'),
      wrapCsvValue('Year Admitted'),
      wrapCsvValue('Course'),
      wrapCsvValue('Department'),
      wrapCsvValue('College'),
      wrapCsvValue('Student Status'),
      wrapCsvValue('Position Candidacy'),
    ];
    const rows = [header.join(',')].concat(
      this.allRepresentative.map((c) =>
        [
          wrapCsvValue(String(c.student?.school_id || '')),
          wrapCsvValue(String(c.student?.first_name || '')),
          wrapCsvValue(String(c.student?.middle_name || '')),
          wrapCsvValue(String(c.student?.last_name || '')),
          wrapCsvValue(String(c.student?.yr_admitted || '')),
          wrapCsvValue(String(c.student?.course || '')),
          wrapCsvValue(String(c.student?.department || '')),
          wrapCsvValue(String(c.student?.college || '')),
          wrapCsvValue(c.college_status),
          wrapCsvValue(c.position),
        ].join(',')
      )
    );
    const status = exportFile(
      'category-export.csv',
      rows.join('\r\n'),
      'text/csv'
    );
    if (status !== true) {
      this.$q.notify({
        message: 'Browser denied file download...',
        color: 'negative',
        icon: 'warning',
      });
    }
  }
  
}
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 100%
  max-height: 100%
  width: 100%
  max-width: 100%


  .q-table__top,
  .q-table__bottom,

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
