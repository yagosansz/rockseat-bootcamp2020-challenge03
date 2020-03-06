import Bee from 'bee-queue';
import AddedDeliveryMail from '../app/jobs/AddedDeliveryMail';
import redisConfig from '../config/redis';

const jobs = [AddedDeliveryMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  // bee is a sub-queue that will connect and interact with Redis
  // new Bee <-> new Queue
  // handle is the method that will process the job
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // add a job to a sub-queue bee
  add(subQueue, job) {
    return this.queues[subQueue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
