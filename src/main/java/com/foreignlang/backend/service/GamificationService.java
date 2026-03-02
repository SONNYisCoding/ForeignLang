package com.foreignlang.backend.service;

import com.foreignlang.backend.entity.GroupMember;
import com.foreignlang.backend.entity.StudentGroup;
import com.foreignlang.backend.entity.UsageQuota;
import com.foreignlang.backend.entity.User;
import com.foreignlang.backend.repository.GroupMemberRepository;
import com.foreignlang.backend.repository.StudentGroupRepository;
import com.foreignlang.backend.repository.UsageQuotaRepository;
import com.foreignlang.backend.repository.UserVocabularyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UsageQuotaRepository usageQuotaRepository;
    private final UserVocabularyRepository userVocabularyRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final StreakService streakService;

    /**
     * Call this when a user's streak might have hit a milestone
     * Returns true if a reward was granted
     */
    @Transactional
    public boolean checkAndRewardStreakMilestone(User user, String timezone) {
        int currentStreak = streakService.getEffectiveStreak(user, timezone);

        // We only reward exactly on the 7th, 14th, 21st, etc. day milestone
        // Note: For MVP, every 7 days gives +5 bonus AI credits
        if (currentStreak > 0 && currentStreak % 7 == 0) {
            // Need to make sure we don't reward multiple times for the same day if they
            // reload
            // In a real system, we'd have a MilestoneRecord table. Here we assume
            // updateStreak
            // is only called once per day by checking if LastActivity changes to today
            // beforehand.
            LocalDate today = LocalDate.now();
            if (user.getLastActivityDate() != null && user.getLastActivityDate().equals(today)) {
                // Find and update usage quota
                UsageQuota quota = usageQuotaRepository.findByUserId(user.getId())
                        .orElseGet(() -> {
                            UsageQuota newQuota = UsageQuota.createForNewUser(user);
                            return usageQuotaRepository.save(newQuota);
                        });

                // Add 5 bonus credits
                int currentPurchased = quota.getPurchasedCredits() != null ? quota.getPurchasedCredits() : 0;
                quota.setPurchasedCredits(currentPurchased + 5);
                usageQuotaRepository.save(quota);
                return true;
            }
        }
        return false;
    }

    /**
     * Gets the leaderboard for a specific group based on words mastered
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getGroupLeaderboard(UUID groupId) {
        StudentGroup group = studentGroupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        List<GroupMember> members = groupMemberRepository.findByGroup(group);

        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (GroupMember member : members) {
            User user = member.getLearner();
            long masteredCount = userVocabularyRepository.countByUserAndIsMasteredTrue(user);

            Map<String, Object> entry = new HashMap<>();
            entry.put("userId", user.getId());
            entry.put("name", user.getFullName() != null && !user.getFullName().isBlank() ? user.getFullName()
                    : user.getEmail());
            entry.put("avatar", user.getAvatarUrl());
            entry.put("score", masteredCount);

            leaderboard.add(entry);
        }

        // Sort descending by score
        leaderboard.sort((a, b) -> Long.compare((Long) b.get("score"), (Long) a.get("score")));

        // Assign ranks
        int rank = 1;
        for (int i = 0; i < leaderboard.size(); i++) {
            Map<String, Object> current = leaderboard.get(i);

            // Handle ties
            if (i > 0) {
                Map<String, Object> previous = leaderboard.get(i - 1);
                if (current.get("score").equals(previous.get("score"))) {
                    current.put("rank", previous.get("rank"));
                } else {
                    current.put("rank", rank);
                }
            } else {
                current.put("rank", rank);
            }
            rank++;
        }

        return leaderboard;
    }
}
