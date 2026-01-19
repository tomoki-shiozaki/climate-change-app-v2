from rest_framework import serializers

from apps.dataset.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
    # ownerはユーザー側から送らせず、バックエンドで設定
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    schema = serializers.JSONField(required=False)  # フロントから送信可能

    class Meta:
        model = Dataset
        fields = [
            "id",
            "name",
            "source_file",
            "owner",
            "status",
            "schema",
            "created_at",
        ]

    def validate_schema(self, value):
        """
        schemaに必ず'time'と'value'が含まれていることを確認
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("schema must be a JSON object")
        required_keys = ["time", "value"]
        missing_keys = [k for k in required_keys if k not in value]
        if missing_keys:
            raise serializers.ValidationError(
                f"schema is missing required keys: {', '.join(missing_keys)}"
            )
        return value

    def create(self, validated_data):
        # リクエストのユーザーを owner にセット
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["owner"] = request.user
        return super().create(validated_data)
