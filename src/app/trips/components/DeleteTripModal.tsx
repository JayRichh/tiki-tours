"use client";

import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Text } from "~/components/ui/Text";

import { Trip } from "~/types/trips";

interface DeleteTripModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTripModal({ trip, isOpen, onClose, onConfirm }: DeleteTripModalProps) {
  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Trip">
      <div className="space-y-6">
        <Text variant="body">
          Are you sure you want to delete {trip.destination}? This action cannot be undone.
        </Text>
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
