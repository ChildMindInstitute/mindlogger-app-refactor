type Job = {
  run: JobRun;
};

type JobRun = () => Promise<unknown> | unknown;

export const createJob = (run: JobRun): Job => {
  return {
    run,
  };
};

export const jobRunner = {
  run(job: Job) {
    return Promise.resolve(job.run());
  },
  runAll(jobs: Job[]) {
    const promises = jobs.map((job) => Promise.resolve(job.run()));

    return Promise.all(promises);
  },
  async runAllSync(jobs: Job[]) {
    for (const job of jobs) {
      await Promise.resolve(job.run());
    }
  },
};
