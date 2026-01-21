import csv

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

    def validate(self, attrs):
        source_file = attrs.get("source_file")
        schema = attrs.get("schema")

        # 両方そろっているときだけチェック
        if not source_file or not schema:
            return attrs

        time_col = schema.get("time")
        value_col = schema.get("value")

        if not time_col or not value_col:
            # validate_schema で弾かれる想定だが念のため
            return attrs

        # ヘッダ行だけ読む
        try:
            source_file.seek(0)
            raw_line = source_file.readline()
            header_line = raw_line.decode("utf-8-sig")
        except UnicodeDecodeError:
            raise serializers.ValidationError(
                "CSVの文字コードはUTF-8である必要があります"
            )
        finally:
            source_file.seek(0)

        if not header_line.strip():
            raise serializers.ValidationError("CSVにヘッダ行が存在しません")

        # csvとして正しく分解
        try:
            reader = csv.reader([header_line])
            header = next(reader)
        except Exception:
            raise serializers.ValidationError("CSVのヘッダ行を正しく解析できません")

        header = [h.strip() for h in header]

        missing = [col for col in (time_col, value_col) if col not in header]
        if missing:
            raise serializers.ValidationError(
                f"CSVに存在しない列名: {', '.join(missing)}"
            )

        return attrs

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
