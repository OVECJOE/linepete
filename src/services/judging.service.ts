// src/services/judging-service.ts
import { PrismaClient } from '@prisma/client'
import DatabaseConnection from '../config/database'

interface JudgeAssignmentStrategy {
  assignJudges(competition: Competition, availableJudges: User[]): User[]
}

class RandomJudgeAssignment implements JudgeAssignmentStrategy {
  assignJudges(competition: Competition, availableJudges: User[]): User[] {
    const requiredJudgeCount = this.calculateRequiredJudges(competition)
    
    // Shuffle judges and select randomly
    return this.shuffleArray(availableJudges)
      .slice(0, requiredJudgeCount)
  }

  private calculateRequiredJudges(competition: Competition): number {
    // Complex logic to determine judge count based on competition size, complexity
    const participantCount = competition.participants.length
    return Math.min(
      Math.ceil(participantCount * 0.1), // 10% of participants
      5 // Max 5 judges
    )
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }
}

class JudgingService {
  private prisma: PrismaClient
  private assignmentStrategy: JudgeAssignmentStrategy

  constructor() {
    this.prisma = DatabaseConnection.getInstance()
    this.assignmentStrategy = new RandomJudgeAssignment()
  }

  async assignJudgesToCompetition(competitionId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: { participants: true }
    })

    if (!competition) {
      throw new Error('Competition not found')
    }

    const availableJudges = await this.prisma.user.findMany({
      where: { 
        role: 'JUDGE',
        judgingAssignments: {
          none: { competitionId }
        }
      }
    })

    const selectedJudges = this.assignmentStrategy.assignJudges(
      competition, 
      availableJudges
    )

    // Persist judge assignments
    await Promise.all(
      selectedJudges.map(judge => 
        this.prisma.judge.create({
          data: {
            userId: judge.id,
            competitionId: competition.id,
            assignmentStrategy: 'RANDOM'
          }
        })
      )
    )
  }
}

export default JudgingService