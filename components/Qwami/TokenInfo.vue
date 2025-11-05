<template>
  <UAccordion
    :items="sections"
    multiple
    :ui="{ wrapper: 'space-y-2' }"
  >
    <template #default="{ item, open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
      >
        <template #leading>
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
          />
        </template>

        <span class="truncate">{{ item.label }}</span>

        <template #trailing>
          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
    </template>

    <template #utility>
      <div class="text-sm text-gray-300 space-y-3 px-4 py-3">
        <p class="text-gray-400">
          QWAMI tokens are consumed when using AI services:
        </p>

        <div class="space-y-2">
          <div>
            <p class="font-semibold text-white">AI Interactions</p>
            <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
              <li>Chat messages: 1-10 QWAMI per message</li>
              <li>Voice responses: 5-20 QWAMI per response</li>
              <li>Code generation: 20-200 QWAMI per request</li>
              <li>Complex reasoning: 10-100 QWAMI per task</li>
            </ul>
          </div>

          <div>
            <p class="font-semibold text-white">Voice & Audio</p>
            <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
              <li>Text-to-speech: 5 QWAMI per 100 words</li>
              <li>Voice cloning: 500 QWAMI per model</li>
              <li>Emotional modulation: +2 QWAMI extra</li>
            </ul>
          </div>

          <div>
            <p class="font-semibold text-white">Advanced Features</p>
            <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
              <li>Long-term memory: 10 QWAMI/day</li>
              <li>Personality training: 100-1000 QWAMI per session</li>
              <li>Multi-Kwami interactions: 5 QWAMI per Kwami</li>
            </ul>
          </div>
        </div>
      </div>
    </template>

    <template #economics>
      <div class="text-sm text-gray-300 space-y-3 px-4 py-3">
        <div>
          <p class="font-semibold text-white">Deflationary Model</p>
          <p class="text-gray-400 text-xs mt-1">
            Tokens are <span class="text-green-400">minted</span> when purchased and 
            <span class="text-red-400">burned</span> when AI services are consumed.
            This creates scarcity over time as usage increases.
          </p>
        </div>

        <div>
          <p class="font-semibold text-white">Supply Mechanics</p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
            <li>Maximum supply: 1 trillion tokens</li>
            <li>Base price: $0.01 USD per token</li>
            <li>All minting/burning tracked on-chain</li>
            <li>Cannot exceed max supply cap</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-white">Earning QWAMI</p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
            <li>Stake Kwami NFTs: 100+ QWAMI/day</li>
            <li>Referral program rewards</li>
            <li>Community contributions</li>
            <li>Bug bounties & governance</li>
          </ul>
        </div>
      </div>
    </template>

    <template #governance>
      <div class="text-sm text-gray-300 space-y-3 px-4 py-3">
        <p class="text-gray-400 text-xs">
          QWAMI holders participate in ecosystem decisions through on-chain voting.
        </p>

        <div>
          <p class="font-semibold text-white">Voting Power</p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
            <li>1 QWAMI = 1 vote</li>
            <li>Minimum 10,000 QWAMI to propose</li>
            <li>Minimum 1,000 QWAMI to vote</li>
            <li>7-day voting period</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-white">Governance Decisions</p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
            <li>Base price adjustments</li>
            <li>New feature pricing</li>
            <li>Treasury management</li>
            <li>Partnership approvals</li>
            <li>Protocol upgrades</li>
          </ul>
        </div>
      </div>
    </template>

    <template #disclaimer>
      <div class="text-sm text-gray-300 space-y-3 px-4 py-3 bg-yellow-500/10 rounded-lg">
        <div>
          <p class="font-semibold text-yellow-400 flex items-center gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            Not an Investment Vehicle
          </p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-2">
            <li>QWAMI is a utility token for AI services</li>
            <li>No guaranteed returns or appreciation</li>
            <li>Value depends on platform usage</li>
            <li>Used for consumption, not speculation</li>
          </ul>
        </div>

        <div>
          <p class="font-semibold text-green-400">What Makes It Valuable</p>
          <ul class="list-disc list-inside text-gray-400 text-xs space-y-1 mt-1">
            <li>Required for AI interactions</li>
            <li>Deflationary (burned on use)</li>
            <li>Capped supply (scarcity)</li>
            <li>Staking rewards available</li>
            <li>Community governance rights</li>
          </ul>
        </div>
      </div>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
const sections = [
  {
    label: 'Utility & Use Cases',
    icon: 'i-heroicons-sparkles',
    slot: 'utility',
    defaultOpen: false,
  },
  {
    label: 'Economics & Supply',
    icon: 'i-heroicons-currency-dollar',
    slot: 'economics',
    defaultOpen: false,
  },
  {
    label: 'Governance',
    icon: 'i-heroicons-user-group',
    slot: 'governance',
    defaultOpen: false,
  },
  {
    label: 'Important Disclaimer',
    icon: 'i-heroicons-exclamation-triangle',
    slot: 'disclaimer',
    defaultOpen: false,
  },
];
</script>
