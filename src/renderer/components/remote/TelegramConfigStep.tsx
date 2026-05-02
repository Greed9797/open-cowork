/**
 * TelegramConfigStep — Telegram bot token and DM policy configuration
 */

import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

interface Props {
  botToken: string;
  dmPolicy: string;
  onBotTokenChange: (value: string) => void;
  onDmPolicyChange: (value: string) => void;
}

export function TelegramConfigStep({
  botToken,
  dmPolicy,
  onBotTokenChange,
  onDmPolicyChange,
}: Props) {
  const { t } = useTranslation();

  const dmPolicies = [
    { value: 'pairing', label: t('remote.policyPairing'), desc: t('remote.policyPairingDesc') },
    {
      value: 'allowlist',
      label: t('remote.policyAllowlist'),
      desc: t('remote.policyAllowlistDesc'),
    },
    { value: 'open', label: t('remote.policyOpen'), desc: t('remote.policyOpenDesc') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-1">
          {t('remote.telegramTitle', 'Telegram Bot')}
        </h3>
        <p className="text-sm text-text-secondary">
          {t(
            'remote.telegramDesc',
            'Connect a Telegram bot to send and receive messages. Create a bot with @BotFather to get your token.'
          )}
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t('remote.telegramBotToken', 'Bot Token')}
          </label>
          <input
            type="password"
            value={botToken}
            onChange={(e) => onBotTokenChange(e.target.value)}
            className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder="123456789:AAF••••••••••••••••••••••••"
          />
          <p className="mt-1.5 text-xs text-text-muted">
            {t(
              'remote.telegramBotTokenHint',
              'Get your token from @BotFather on Telegram. Send /newbot to create a new bot.'
            )}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t('remote.dmPolicy')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dmPolicies.map((option) => (
              <button
                key={option.value}
                onClick={() => onDmPolicyChange(option.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  dmPolicy === option.value
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="font-medium text-text-primary text-sm">{option.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-muted bg-background-secondary/60 p-4 space-y-2">
        <p className="text-sm font-medium text-text-primary">
          {t('remote.telegramPollingMode', 'Long-polling mode')}
        </p>
        <p className="text-xs text-text-muted">
          {t(
            'remote.telegramPollingDesc',
            'The bot uses long-polling — no public URL or webhook needed. Works behind firewalls and NAT.'
          )}
        </p>
      </div>

      <a
        href="https://t.me/BotFather"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
      >
        <ExternalLink className="w-4 h-4" />
        {t('remote.openBotFather', 'Open @BotFather on Telegram')}
      </a>
    </div>
  );
}
