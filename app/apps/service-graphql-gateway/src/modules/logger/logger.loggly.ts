import winston from 'winston';
import {utilities as nestWinstonModuleUtilities} from 'nest-winston';
import {Loggly} from 'winston-loggly-bulk';
import {LogglyAPIMetrics} from "../../constant/loggly";

const DEFAULT_SEND_LOG_TIME = 1;

export const transports = {
  console: new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      nestWinstonModuleUtilities.format.nestLike(),
    ),
  }),
  loggly: new Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    json: true,
    isBulk: true,
  }),
};

/**
 * Add Loggly transport
 */
winston.add(transports.loggly);

/**
 * Enable Console log during dev
 */
if (process.env.NODE_ENV === 'development') {
  winston.add(transports.console);
}

const _sendLog = (level, { tags, message, object }) => {
  if (level === 'error') {
    winston.log({
      level,
      message,
      object,
      env: process.env.NODE_ENV,
      service: process.env.SERVICE_NAME,
      tags,
    });
  }
};

console.info = (tags, message, object = null) => {
  _sendLog('info', {
    tags,
    message,
    object,
  });
};

console.warn = function (tags, message, object = null) {
  _sendLog('warn', {
    tags,
    message,
    object,
  });
};

console.error = function (tags, message, object = null) {
  _sendLog('error', {
    tags,
    message,
    object,
  });
};

class Logger {
  // In minutes
  _period = DEFAULT_SEND_LOG_TIME;

  _metricGroups = [
    {
      key: 'API_REQUEST',
      name: 'API handling metrics',
      defaultTags: ['request'],
      metrics: [
        LogglyAPIMetrics.Auth,
        LogglyAPIMetrics.Asset,
      ],
    },
    {
      key: 'DB_QUERY',
      name: 'Database query metrics',
      defaultTags: ['database'],
      metrics: ['select', 'insert', 'update', 'delete'],
    },
    {
      key: 'EXTERNAL',
      name: 'External communication metrics',
      defaultTags: ['external'],
      // For example: aws-sqs, aws-s3
      metrics: ['aws-sqs', 'aws-s3'],
    },
  ];

  // Metric object key prefix, only for local object
  _metricNamePrefix = 'game-service-metrics-';

  constructor() {
    // Send logged metrics to Loggly periodically
    setInterval(() => {
      console.log('[Logger] Interval run each 5 mins');
      this._sendLogMetrics();
    }, this._period * 60 * 1000);
  }

  // Convert metric array to normalized object
  _formatMetrics(metrics = []) {
    return {
      success: metrics[0],
      failure: metrics[1],
      total: metrics[0] + metrics[1],
    };
  }

  // Send log metrics of all groups, then reset to init values
  _sendLogMetrics() {
    // Log api request metrics
    for (const group of this._metricGroups) {
      for (let name of group.metrics) {
        name = this._metricNamePrefix + name;
        const result = this[name];
        if (result && (result[0] > 0 || result > 0)) {
          console.info(
            ['metrics', ...group.defaultTags, name.replace(this._metricNamePrefix, '')],
            group.name,
            this._formatMetrics(this[name]),
          );

          // Reset metrics to 0
          this[name] = [0, 0];
        }
      }
    }
  }

  _recordMetrics(metricName, groupName, success = true) {
    const group = this._metricGroups.find((item) => item.key === groupName);
    if (!group || !group.metrics.includes(metricName)) {
      console.log('[Logger] Cannot record metrics ', metricName, groupName);
      return;
    }
    const name = this._metricNamePrefix + metricName;
    // Init api metric values
    if (!this[name]) {
      this[name] = [0, 0];
    }
    if (success) {
      this[name][0] += 1;
    } else {
      this[name][1] += 1;
    }
  }

  // Accumulate API request successes or failures
  recordAPIRequest(name: string, success: boolean) {
    this._recordMetrics(name, 'API_REQUEST', success);
    return this;
  }

  // Accumulate DB query successes or failures
  recordDBAction(action, success: boolean) {
    this._recordMetrics(action.toLowerCase(), 'DB_QUERY', success);
    return this;
  }

  // Accumulate External 3rd party call successes or failures
  recordExternalCommunication(service, success: boolean) {
    this._recordMetrics(service, 'EXTERNAL', success);
    return this;
  }
}

const metricsLogger = new Logger();

export { metricsLogger };
