import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Ticket } from '../models'

const STORAGE_KEY = 'bus_ticket_demo_wallet_v1'

function load(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Ticket[]
  } catch {
    return []
  }
}

function save(tickets: Ticket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // ignore
  }
}

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>(load())

  const hasTickets = computed(() => tickets.value.length > 0)

  function add(ticket: Ticket) {
    tickets.value.unshift(ticket)
    save(tickets.value)
  }

  function get(ticketId: string): Ticket | undefined {
    return tickets.value.find(t => t.id === ticketId)
  }

  function clear() {
    tickets.value = []
    save([])
  }

  return { tickets, hasTickets, add, get, clear }
})
