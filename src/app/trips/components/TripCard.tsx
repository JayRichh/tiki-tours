"use client";

import { DollarSign, Edit2, Trash2, Users } from "lucide-react";

import Link from "next/link";

import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Progress } from "~/components/ui/Progress";
import { Text } from "~/components/ui/Text";

import { Trip } from "~/types/trips";

import { statusColors } from "../constants";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  return (
    <Link href={`/trips/${trip.slug}`} className="block">
      <Card variant="elevated" interactive className="transition-transform hover:scale-[1.02]">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span>{trip.destination}</span>
              <Badge className={statusColors[trip.status]}>{trip.status}</Badge>
            </div>
          }
          subtitle={
            <div className="text-sm text-foreground-secondary">
              {new Date(trip.startDate).toLocaleDateString()} -{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </div>
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                leftIcon={<Edit2 className="h-4 w-4" />}
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(trip);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(trip);
                }}
              />
            </div>
          }
        />
        <CardContent>
          <div className="space-y-4">
            {trip.tripDetails && (
              <Text variant="body-sm" color="secondary">
                {trip.tripDetails}
              </Text>
            )}
            <div className="flex items-center gap-6">
              {trip.tripBudget ? (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-foreground-secondary" />
                  <Text variant="body-sm" color="secondary">
                    ${trip.tripBudget.toLocaleString()}
                  </Text>
                </div>
              ) : (
                trip.relocationPlan && <Badge variant="secondary">Relocation</Badge>
              )}
              {trip.numberOfTravelers && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-foreground-secondary" />
                  <Text variant="body-sm" color="secondary">
                    {trip.numberOfTravelers} travelers
                  </Text>
                </div>
              )}
            </div>
            {trip.tripBudget && trip.spentSoFar !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget spent</span>
                  <span>{Math.round((trip.spentSoFar / trip.tripBudget) * 100)}%</span>
                </div>
                <Progress value={(trip.spentSoFar / trip.tripBudget) * 100} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
